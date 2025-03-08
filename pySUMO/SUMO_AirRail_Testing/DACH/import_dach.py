import subprocess

# Define input and output files
osm_file = "dach.osm"  # Your downloaded OSM file
output_net = "dach.net.xml"

# Define basic netconvert options
netconvert_options = [
    "netconvert",
    "--osm-files", osm_file,
    "--output-file", output_net,
    "--geometry.max-segment-length", "200",
    "--remove-edges.isolated", "true",
    "--railway.all",
    "--tls.guess",
    "--osm.bike-access",
    "--verbose",
    "--ignore-errors"  # Skip errors to see if the process completes
]

try:
    subprocess.run(netconvert_options, check=True)
    print(f"Network successfully generated: {output_net}")
except subprocess.CalledProcessError as e:
    print("netconvert failed!")
    print(f"Error message: {e}")
    print(f"Command: {' '.join(e.cmd)}")
    print(f"Exit code: {e.returncode}")
