# Mermaid to Draw.io Packet Diagram Converter

A Node.js tool that converts Mermaid packet-beta syntax diagrams into Draw.io XML format for visualizing network protocol headers and packet structures.

## Features

- Converts Mermaid packet diagrams to editable Draw.io format
- Supports bit-level precision for network protocol visualization
- Generates clean XML output compatible with diagrams.net

## Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

```bash
node converter.js <inputFile> [-o outputFile]
```

### Options

- `<inputFile>`: Path to the Mermaid packet diagram file (.mmd)
- `-o, --output <path>`: Output file path (default: output.drawio)

### Example

```bash
node converter.js tcp_header.mmd -o tcp_header.drawio
```

## Packet Diagram Format

Use the `packet-beta` syntax in your Mermaid files:

```
packet-beta
0-15: "Source Port"
16-31: "Destination Port"
32-47: "Length"
48-63: "Checksum"
```

- Each line defines a bit range: `start-end: "Label"`
- Bit numbering starts from 0
- Labels should be enclosed in quotes

## Included Diagrams

This repository includes several example packet diagrams:

### Network Protocol Headers
- **TCP Header** (`tcp_header.mmd`) - Transmission Control Protocol header structure
- **UDP Header** (`udp_header.mmd`) - User Datagram Protocol header structure
- **IPv4 Header** (`ipv4_header.mmd`) - Internet Protocol version 4 header structure
- **ICMP Header** (`icmp_header.mmd`) - Internet Control Message Protocol header structure

### Link Layer
- **Ethernet Frame** (`ethernet_frame.mmd`) - Ethernet frame structure
- **ARP Packet** (`arp_packet.mmd`) - Address Resolution Protocol packet structure

## Opening in Draw.io

1. Go to [diagrams.net](https://app.diagrams.net/)
2. Click "Open Existing Diagram"
3. Select the `.drawio` file
4. The diagram will load with proper layout and styling

## Dependencies

- [xmlbuilder2](https://www.npmjs.com/package/xmlbuilder2) - XML generation
- [commander](https://www.npmjs.com/package/commander) - CLI argument parsing

## License

ISC
