#!/usr/bin/env node
const fs = require('fs');
const { create } = require('xmlbuilder2');
const { program } = require('commander');

// --- 1. CONFIGURATION ---
const CELL_WIDTH = 20;  // Width of a single bit in pixels
const CELL_HEIGHT = 40; // Height of a row in pixels
const ROW_WIDTH_BITS = 32; // Standard packet width

// --- 2. PARSER ---
// Parses Mermaid packet-beta syntax into a structured array of blocks
function parseMermaidPacket(source) {
    const lines = source.split('\n');
    const blocks = [];

    // Regex to match: 0-15: "Label" OR 0-15: Label
    // Groups: 1=Start, 2=End, 3=Label (quoted), 4=Label (unquoted)
    const lineRegex = /^\s*(\d+)-(\d+):\s*(?:"([^"]*)"|(.+))\s*$/;

    lines.forEach(line => {
        const match = line.match(lineRegex);
        if (match) {
            blocks.push({
                start: parseInt(match[1], 10),
                end: parseInt(match[2], 10),
                label: match[3] || match[4]
            });
        }
    });

    return blocks;
}

// --- 3. LAYOUT ENGINE ---
// Converts bit ranges into X/Y coordinates for Draw.io
function calculateLayout(blocks) {
    return blocks.map(block => {
        const bitLength = block.end - block.start + 1;
        
        // Calculate position in the grid
        // We assume the start bit determines the X position relative to the 32-bit row
        const row = Math.floor(block.start / ROW_WIDTH_BITS);
        const startBitInRow = block.start % ROW_WIDTH_BITS;

        return {
            label: block.label,
            x: startBitInRow * CELL_WIDTH,
            y: row * CELL_HEIGHT,
            width: bitLength * CELL_WIDTH,
            height: CELL_HEIGHT
        };
    });
}

// --- 4. XML GENERATOR (Draw.io format) ---
function generateDrawioXml(layoutData) {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('mxfile', { host: 'Electron', type: 'device' })
        .ele('diagram', { name: 'Page-1', id: 'diagram_1' })
        .ele('mxGraphModel', { 
            dx: '1422', dy: '798', grid: '1', gridSize: '10', 
            guides: '1', tooltips: '1', connect: '1', arrows: '1', fold: '1', 
            page: '1', pageScale: '1', pageWidth: '850', pageHeight: '1100' 
        })
        .ele('root');

    // Default required mxGraph layers
    root.ele('mxCell', { id: '0' });
    root.ele('mxCell', { id: '1', parent: '0' });

    // Generate a cell for each packet block
    layoutData.forEach((item, index) => {
        const cellId = `cell_${index + 2}`;
        
        const mxCell = root.ele('mxCell', {
            id: cellId,
            value: item.label,
            style: 'rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;',
            parent: '1',
            vertex: '1'
        });

        mxCell.ele('mxGeometry', {
            x: String(item.x),
            y: String(item.y),
            width: String(item.width),
            height: String(item.height),
            as: 'geometry'
        });
    });

    return root.end({ prettyPrint: true });
}

// --- 5. CLI HANDLER ---
program
    .name('mermaid2drawio')
    .description('Convert Mermaid Packet diagrams to Draw.io XML')
    .argument('<inputFile>', 'Path to the mermaid file')
    .option('-o, --output <path>', 'Output file path', 'output.drawio')
    .action((inputFile, options) => {
        try {
            const inputContent = fs.readFileSync(inputFile, 'utf-8');
            console.log(`Processing ${inputFile}...`);

            const parsedBlocks = parseMermaidPacket(inputContent);
            if (parsedBlocks.length === 0) {
                console.warn("No packet blocks found. Ensure format is 'start-end: label'");
                return;
            }

            const layout = calculateLayout(parsedBlocks);
            const xmlOutput = generateDrawioXml(layout);

            fs.writeFileSync(options.output, xmlOutput);
            console.log(`Success! Saved to ${options.output}`);
            console.log(`You can now open ${options.output} in https://app.diagrams.net/`);

        } catch (error) {
            console.error("Error:", error.message);
        }
    });

program.parse();