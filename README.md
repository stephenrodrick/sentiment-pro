# 🧠 Sentiment Analysis AI Agent

**Sentiment Analysis AI Agent** is an intelligent, web-based tool that classifies any text input into **Positive**, **Neutral**, or **Negative** sentiment in real-time using **Together AI's language models**.

> 🔗 Live Demo: [https://v0-sentiment-analysis-ai.vercel.app](https://v0-sentiment-analysis-ai.vercel.app)  
> 🧑‍💻 GitHub Repo: [https://github.com/stephenrodrick/sentiment-pro](https://github.com/stephenrodrick/sentiment-pro)

This project was built for the **AI Agent Hackathon** hosted by **Product Space on Unstop**. The goal was to create an AI-powered application that behaves like an agent — **understands input, performs intelligent analysis, and returns meaningful, contextual results**.

---

## 📌 What This Project Does

### 🔍 Core Purpose
It provides users with an **easy-to-use platform** where they can paste any sentence, review, or comment — and the system will analyze the **emotional tone** and **return its sentiment category** in under 2 seconds.

### ✅ Use Cases
- Customer feedback analysis
- Product review classification
- Social media monitoring
- Emotional health tracking
- Education tools for NLP understanding

---

## 💡 How It Works (Step-by-Step)

### 1. **User Input**
The user types or pastes a sentence like:
> "The product arrived late and was damaged."

### 2. **API Call to Together AI**
The app sends the input to the **Together AI API** with a specific prompt:
> "Classify the following text as Positive, Neutral, or Negative sentiment."

### 3. **AI Model Processes the Input**
Together AI's large language model interprets the sentence and responds with the predicted sentiment:
> `Negative`

### 4. **Result Displayed on Screen**
The app shows the result with:
- Color coding (green = positive, grey = neutral, red = negative)
- Optional emoji/icon for visualization
- Text is saved into **session memory** below for reference

### 5. **Session-Based History**
Each result is stored temporarily on the frontend so users can track what they’ve analyzed during the session.

---

## ⚙️ Technologies Used

| Layer       | Tools / Libraries          |
|-------------|----------------------------|
| Frontend    | **React.js**, **Next.js**  |
| API/Backend | **Together AI API**        |
| Styling     | **Tailwind CSS**           |
| Hosting     | **Vercel**                 |

---

## 🖼️ Screenshots

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop Screenshot](./public/screenshot1.jpg) | ![Mobile Screenshot](./public/screenshot2.jpg) |

---

## 🧱 Project Structure

```

sentiment-pro/
├── pages/
│   └── index.js           # Main app logic
├── components/
│   └── SentimentBox.jsx   # Component to show the result
├── utils/
│   └── api.js             # Handles API call to Together AI
├── styles/
│   └── globals.css        # Tailwind and custom styles
├── public/
│   └── favicon, images    # Assets for UI
└── .env.local             # API key (not shared)

````

---

## 🛠️ Run Locally

```bash
git clone https://github.com/stephenrodrick/sentiment-pro.git
cd sentiment-pro
npm install
````

Create a `.env.local` file and add your Together AI API key:

```env
OPEN_AI_KEY=your_api_key_here
TWITTER_API_KEY=your_api_key_here
```

Run the app locally:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🔮 Upcoming Features

* 📊 **Sentiment Charting** – visualize sentiment trends
* 🌐 **Multilingual Support** – Hindi, Tamil, etc.
* 📥 **Export to CSV/PDF** – download analysis
* 🧠 **Emotion Detection** – joy, anger, sarcasm, etc.
* 🗂️ **History Log** – store past results per user session

---

## 🧠 Why This Is More Than Just a Classifier

This is not just a simple API frontend. It acts like an **AI agent** because:

* It accepts human natural language inputs
* It interprets them using deep learning
* It responds with human-like understanding
* It maintains contextual memory of your inputs during a session
* It’s scalable and can be enhanced with voice input, multi-language NLP, and more!

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* Hackathon: [AI Agent Hackathon by Product Space](https://unstop.com/hackathons/ai-agent-hackathon-product-space-1512428)
* NLP API: [Together AI](https://www.together.ai/)
* Hosting: [Vercel](https://vercel.com/)

---

## ✨ Author

**Stephen Rodrick**
B.Tech Biotechnology, SRM Ramapuram
🔗 [LinkedIn](https://www.linkedin.com/in/stephen-rodrick)
📫 Email: [stephenrodrick.dev@gmail.com](mailto:stephenrodrick17@gmail.com)

---

## 🔗 Important Links

* 🔴 Live App: [https://v0-sentiment-analysis-ai.vercel.app](https://v0-sentiment-analysis-ai.vercel.app)
* 🧑‍💻 GitHub Repo: [https://github.com/stephenrodrick/sentiment-pro](https://github.com/stephenrodrick/sentiment-pro)
* 🎥 Coming Soon: Walkthrough video for demo and features

```


