import subprocess
import os

# Ensure SUMO_HOME is set
os.environ['SUMO_HOME'] = 'C:/Program Files (x86)/Eclipse/Sumo'  # Set this to your SUMO installation directory

# Command to generate trips
command = [
    "python",
    os.path.join(os.environ['SUMO_HOME'], "tools", "randomTrips.py"),
    "-n", "dach-railways.net.xml",
    "-r", "trains.rou.xml",
    # "--trip-attributes", "type='rail'",
    # "--allow-fringe",
    # "--prefix", "train",
    # "--weights-prefix", "weights",
    "--period", "1",
    "--begin", "0",
    "--end", "60"
]

# Run the command
subprocess.run(command, check=True)
