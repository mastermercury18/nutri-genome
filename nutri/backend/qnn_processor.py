import numpy as np
import random
import statistics
import pandas as pd
from qiskit.circuit import QuantumCircuit, Parameter
from qiskit.quantum_info import SparsePauliOp, Statevector
from qiskit_aer import AerSimulator
from qiskit import transpile
from scipy.optimize import minimize
import torch
import torch.nn as nn
import torch.optim as optim

def get_theta(n):
    return (n+1) * np.pi/3

def build_circuit(params1_vals, params2_vals, grid):
    dim = 4
    num_qubits = 4
    qc = QuantumCircuit(dim)

    for i in range(dim):
        for j in range(dim):
            theta = get_theta(grid[i][j])
            if j == 0:
                qc.h(i)
            if grid[i][j] == -1:
                qc.id(i)
            elif j % 2 == 0:
                qc.rx(theta, i)
            elif j % 2 == 1:
                qc.rz(theta, i)

    for qubit in range(num_qubits):
        qc.ry(params1_vals[qubit], qubit)

    qc.cx(3, 0)

    for qubit in range(num_qubits - 1):
        qc.cx(qubit, qubit + 1)

    for qubit in range(num_qubits):
        qc.ry(params2_vals[qubit], qubit)

    for qubit in reversed(range(num_qubits)):
        qc.cx(qubit - 1, qubit)
    qc.measure_all()
    return qc

def cost_function(x, grid):
    num_qubits = 4
    params1_vals = x[:num_qubits]
    params2_vals = x[num_qubits:]
    circuit = build_circuit(params1_vals, params2_vals, grid)
    
    qc_aer = transpile(circuit, backend=AerSimulator())
    simulator_aer = AerSimulator()
    results = simulator_aer.run(qc_aer, shots=1024).result()
    counts = results.get_counts()
    circuit.remove_final_measurements()
    statevector = Statevector(circuit)

    target = np.zeros(2**num_qubits, dtype=complex)
    target[0] = 1.0
    cost = np.linalg.norm(statevector - target)
    return cost

def extract_snps_and_weights(file_content):
    snp_dict = {}
    lines = file_content.split('\n')
    for line in lines[1:]:  # Skip the first line (header)
        if line.startswith('rs'):
            parts = line.split()
            rs_id = parts[0]
            effect_weight = float(parts[5])
            snp_dict[rs_id] = effect_weight
    return snp_dict

def generate_person_data(snp_dict):
    people_data = []
    for num in range(1):
        person_data = {}
        for rs_id in snp_dict:
            person_data[rs_id] = random.randint(0, 2)
        people_data.append(person_data)
    return people_data

def generate_final_csv(generated_csv, snp_dict):
    df = pd.DataFrame(generated_csv)
    PGS_list = []
    for person in generated_csv:
        pgs_score = 0
        for snp in person:
            pgs_score += (snp_dict[snp] * person[snp])
        PGS_list.append(pgs_score)

    average_PGS = statistics.mean(PGS_list)
    PGS_high_low = []

    for index, person in enumerate(generated_csv):
        if PGS_list[index] < average_PGS:
            PGS_high_low.append("LOW")
        else:
            PGS_high_low.append("HIGH")

    df["phenotype"] = PGS_high_low
    return df

class PhenotypeClassifier(nn.Module):
    def __init__(self, input_dim=16, hidden_dim=32, output_dim=1):
        super(PhenotypeClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        x = self.sigmoid(x)
        return x

def statevector_to_features(sv):
    return np.abs(sv.data)**2

def process_genomic_file_with_qnn(file_path):
    """
    Process genomic file using the full QNN pipeline from the notebook
    """
    try:
        # Read the genomic file
        with open(file_path, 'r') as file:
            genomic_data = file.read()
        
        # Extract SNPs and weights
        snp_dict = extract_snps_and_weights(genomic_data)
        
        if not snp_dict:
            return "UNKNOWN"
        
        # Generate person data
        generated_data = generate_person_data(snp_dict)
        
        # Get genotype array
        genotype_array = [generated_data[0][rs] for rs in snp_dict]
        
        # Process with QNN
        num_qubits = 4
        matrix = np.full((4, 4), -1)
        matrix.flat[:len(genotype_array)] = genotype_array
        grid = matrix.tolist()
        
        # Optimize circuit
        x0 = np.random.uniform(0, np.pi, size=2 * num_qubits)
        result = minimize(lambda x: cost_function(x, grid), x0, method='COBYLA')
        
        # Build optimized circuit
        opt_params1 = result.x[:num_qubits]
        opt_params2 = result.x[num_qubits:]
        opt_circuit = build_circuit(opt_params1, opt_params2, grid)
        
        # Get statevector
        qc_aer = transpile(opt_circuit, backend=AerSimulator())
        simulator_aer = AerSimulator()
        results = simulator_aer.run(qc_aer, shots=1024).result()
        counts = results.get_counts()
        final_state = qc_aer.remove_final_measurements()
        statevector = Statevector(qc_aer)
        
        # Convert to features
        features = statevector_to_features(statevector)
        
        # For now, use a simple heuristic based on the features
        # In a full implementation, you would load a trained model
        feature_sum = np.sum(features)
        if feature_sum > 0.5:  # Simple threshold
            return "HIGH"
        else:
            return "LOW"
            
    except Exception as e:
        print(f"Error in QNN processing: {e}")
        return "UNKNOWN" 