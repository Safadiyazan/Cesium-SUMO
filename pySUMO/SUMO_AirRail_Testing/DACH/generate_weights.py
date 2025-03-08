filtered_edges_file = "filtered_edges.txt"
output_weights_file = "weights.xml"

with open(filtered_edges_file, "r") as f:
    filtered_edges = {line.strip() for line in f}

with open(output_weights_file, "w") as f:
    f.write('<edgedata>\n')
    for edge in filtered_edges:
        f.write(f'  <edge id="{edge}" value="1.0"/>\n')
    f.write('</edgedata>\n')

print(f"Edge weights written to {output_weights_file}")
