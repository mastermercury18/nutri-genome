# NutriGenome - Quantum AI-Powered Personalized Meal Planner 

This project builds a complete genomics-to-nutrition pipeline using synthetic SNP data, quantum-inspired neural networks, and language-model-driven recommendation logic. The goal is to generate adaptive, evidence-aligned meal plans based on a user’s polygenic risk profile—all accessible via a lightweight web interface.

## 🧪 Genetic Risk Modeling

The process begins with simulated SNP data reflecting key nutrition-relevant traits—liver cirrhosis, BMI, and iron absorption. For each individual, the code randomly generates genotypes (0, 1, 2 copies of a risk allele) across curated SNPs. Using published beta coefficients, it computes polygenic risk scores (PRS) for each trait. Based on quantized thresholds, individuals are labeled "HIGH" or "LOW" risk—creating a labeled dataset of synthetic genomic profiles.

This dataset is stored in structured CSVs (e.g., `bmi_generated_data.csv`, `liver_generated_data.csv`) and serves as the training/test bed for downstream models.

## 🧠 Quantum Neural Network (QNN) Integration

Implements a post variational quantum neural network to learn correlations between genetic profiles and nutrition categories. While not run on real quantum hardware, the QNN architecture introduces entanglement-like interactions between features to capture non-linear dependencies that classical linear models might miss.

The model’s goal is to recommend diet types (e.g., high-protein, low-carb, etc.) given a PRS vector.

## 🧬 LLM-Powered Meal Generation

Once a nutrition class is inferred, a prompt-based system powered by OpenAI’s GPT models takes over. The `meal.py` script structures these prompts dynamically—tailoring content based on risk scores, lifestyle flags (e.g., vegetarian), and known restrictions (e.g., lactose intolerance). The generated meal plans are structured, context-aware, and consistent across runs.

This hybrid approach bridges hardcoded SNP risk scoring with generative flexibility—producing meal plans that feel both medically grounded and personalized.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- Sonner for toast notifications

### Backend
- Python Flask server
- OpenAI GPT-4 for meal plan generation
- Guidance framework for structured AI responses
- CORS enabled for frontend communication

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- OpenAI API key

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nutri-quantum-genie
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up OpenAI API key (create a .env file)
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Start the Flask server
python app.py
```

Or use the provided script:
```bash
# Make script executable (if not already)
chmod +x start-backend.sh

# Run the script
./start-backend.sh
```

The backend will be available at `http://localhost:8000`

### 4. Environment Variables

Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### 1. Dashboard
- Navigate to the Dashboard page
- Upload your genomic data file (.txt format)
- Fill in your health profile:
  - Diabetes risk level
  - Lactose intolerance status
  - Calcium intake level
  - Ethnicity
  - Special dietary requests
- Click "Generate Personalized Meal Plan"

### 2. Meal Plan View
- View your AI-generated meal plan
- See detailed nutritional information
- Export your meal plan
- Regenerate meals with different preferences
- Navigate between different days

### 3. Health Insights
- View liver health benefits
- See genomic insights
- Track nutritional metrics

## API Endpoints

### Generate Meal Plan
```
POST /api/meal_plan_submit
Content-Type: application/x-www-form-urlencoded

Parameters:
- diabetes: string (low/medium/high/diabetic)
- lactose: string (no/mild/severe)
- calcium: string (adequate/low/severely_low/high)
- ethnicity: string
- special: string (optional)
```

### Chatbot
```
POST /chatbot
Content-Type: application/json

Body:
{
  "conversation_history": [...],
  "previous_output": "...",
  "input_instructions": "...",
  "message": "..."
}
```

## File Structure

```
nutri-quantum-genie/
├── src/
│   ├── components/          # UI components
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard with form
│   │   └── MealPlan.tsx    # Meal plan display
│   ├── lib/
│   │   ├── api.ts          # API service
│   │   └── mealPlanParser.ts # AI response parser
│   └── ...
├── backend/
│   ├── app.py              # Flask server
│   ├── meal.py             # AI meal generation logic
│   ├── liver.txt           # Genomic data
│   ├── liver_label.txt     # Liver health label
│   └── requirements.txt    # Python dependencies
├── start-backend.sh        # Backend startup script
└── README.md
```

## Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Start Flask server with debug mode
cd backend
python app.py
```

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure Flask server is running on port 8000
   - Check CORS settings in backend/app.py
   - Verify API_BASE_URL in src/lib/api.ts

2. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is set correctly
   - Check API key permissions and quota
   - Ensure proper model access (gpt-4o-mini)

3. **Genomic File Upload**
   - Ensure file is .txt format
   - Check file size (should be reasonable)
   - Verify file contains valid genomic data

4. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration in tsconfig.json
   - Verify import paths are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
