import { LangType } from './dictionary';

export interface AdSegment {
    id: string;
    text: string;
    image: string; // Just base name, e.g. "analyst" (will map to /images/ads/analyst.jpg or similar)
}

export interface AdContent {
    main: string;
    bonus: string;
    segments: AdSegment[];
}

export const TRADINGVIEW_ADS: Record<LangType, AdContent> = {
    JP: {
        main: "「世界を解析する、投資家の標準装備。」 TradingViewは、高度なアルゴリズムと世界の知性が集う金融インテリジェンスの最高峰。あなたの決断を次のステージへ。",
        bonus: "当サイト経由の登録で、15ドル分の特典付き。",
        segments: [
            { id: "beginner", text: "「世界を解析する、投資家の標準装備。」 複雑なマーケット分析を「メーター」一目で把握。プロ級の判断を、直感的に。TradingViewは、あなたの決断を次のステージへ。", image: "analyst.png" },
            { id: "intermediate", text: "「世界を解析する、投資家の標準装備。」 世界中の投資家とリアルタイムで同期し、集合知で未来を予測。TradingViewの「Minds」が、市場の鼓動をあなたに伝えます。", image: "analyst.png" },
            { id: "advanced", text: "「世界を解析する、投資家の標準装備。」 業界最高峰のチャート描画性能で、あらゆる戦略を可視化。緻密な分析と検証が、確信に変わる瞬間を。", image: "analyst.png" }
        ]
    },
    EN: {
        main: "The standard equipment for investors analyzing the world. TradingView merges advanced technical analysis with a global social feed. Elevate your decisions with intuitive Analyst Ratings and Mind features.",
        bonus: "Get a $15 bonus when you sign up through this site.",
        segments: [
            { id: "beginner", text: "\"The standard equipment for investors.\" Simplify complex market analysis with the Technical Meter. Professional-grade judgment, intuitively yours. Take your decisions to the next level.", image: "analyst.png" },
            { id: "intermediate", text: "\"The standard equipment for investors.\" Sync with global investors in real-time. Predict the future with collective intelligence. TradingView's \"Minds\" brings the heartbeat of the market to you.", image: "analyst.png" },
            { id: "advanced", text: "\"The standard equipment for investors.\" Visualize every strategy with industry-leading charting performance. Turn precise analysis and verification into conviction.", image: "analyst.png" }
        ]
    },
    CN: {
        main: "“分析世界，投资者的标准装备。” TradingView 是金融智能的巅峰，融合了先进算法的技术分析和汇聚全球智慧的社交动态。直观的“分析仪表”和反映投资者心理的“思维功能”，将您的决策提升到一个新的高度。",
        bonus: "通过本网站注册，即可获得 $15 奖励。",
        segments: [
            { id: "beginner", text: "“分析世界，投资者的标准装备。” 将复杂的市场分析通过“仪表”一目了然。直观地获得专业级的判断。TradingView 将您的决策提升到新的阶段。", image: "analyst.png" },
            { id: "intermediate", text: "“分析世界，投资者的标准装备。” 与全球投资者实时同步，利用群体智慧预测未来。TradingView 的“Minds”为您传递市场的脉动。", image: "analyst.png" },
            { id: "advanced", text: "“分析世界，投资者的标准装备。” 以业界顶尖的图表绘制性能，可视化所有策略。让精密的分析与验证转化为确信的瞬间。", image: "analyst.png" }
        ]
    },
    ES: {
        main: "“El equipo estándar para inversores que analizan el mundo.” TradingView combina análisis técnico avanzado con un feed social global. Eleve sus decisiones con los intuitivos Ratings de Analistas y funciones de Minds.",
        bonus: "Obtenga un bono de $15 al registrarse a través de este sitio.",
        segments: [
            { id: "beginner", text: "“El equipo estándar para los inversores.” Simplifique el análisis de mercado complejo con el Medidor Técnico. Juicio de nivel profesional, intuitivamente suyo.", image: "analyst.png" },
            { id: "intermediate", text: "“El equipo estándar para los inversores.” Sincronice con inversores globales en tiempo real. Prediga el futuro con inteligencia colectiva.", image: "analyst.png" },
            { id: "advanced", text: "“El equipo estándar para los inversores.” Visualice cada estrategia con un rendimiento de gráficos líder en la industria. Convierta el análisis preciso en convicción.", image: "analyst.png" }
        ]
    },
    HI: {
        main: "“दुनिया का विश्लेषण करने वाले निवेशकों के लिए मानक उपकरण।” TradingView उन्नत तकनीकी विश्लेषण और वैश्विक सामाजिक फ़ीड को मिलाता है। सहज विश्लेषक रेटिंग और माइंड सुविधाओं के साथ अपने निर्णयों को ऊंचा उठाएं।",
        bonus: "इस साइट के माध्यम से साइन अप करने पर $15 का बोनस प्राप्त करें।",
        segments: [
            { id: "beginner", text: "“निवेशकों के लिए मानक उपकरण।” तकनीकी मीटर के साथ जटिल बाजार विश्लेषण को सरल बनाएं। पेशेवर-ग्रेड निर्णय, सहज रूप से आपका।", image: "analyst.png" },
            { id: "intermediate", text: "“निवेशकों के लिए मानक उपकरण।” वास्तविक समय में वैश्विक निवेशकों के साथ सिंक करें। सामूहिक बुद्धिमत्ता के साथ भविष्य की भविष्यवाणी करें।", image: "analyst.png" },
            { id: "advanced", text: "“निवेशकों के लिए मानक उपकरण।” उद्योग-अग्रणी चार्टिंग प्रदर्शन के साथ हर रणनीति की कल्पना करें। सटीक विश्लेषण को दृढ़ विश्वास में बदलें।", image: "analyst.png" }
        ]
    },
    ID: {
        main: "“Peralatan standar bagi investor untuk menganalisis dunia.” TradingView menggabungkan analisis teknis canggih dengan umpan sosial global. Tingkatkan keputusan Anda dengan Peringkat Analis dan fitur Minds yang intuitif.",
        bonus: "Dapatkan bonus $15 saat mendaftar melalui situs ini.",
        segments: [
            { id: "beginner", text: "“Peralatan standar untuk investor.” Sederhanakan analisis pasar yang kompleks dengan Meteran Teknis. Penilaian tingkat profesional, secara intuitif milik Anda.", image: "analyst.png" },
            { id: "intermediate", text: "“Peralatan standar untuk investor.” Sinkronisasi dengan investor global secara real-time. Prediksi masa depan dengan kecerdasan kolektif.", image: "analyst.png" },
            { id: "advanced", text: "“Peralatan standar untuk investor.” Visualisasikan setiap strategi dengan kinerja charting terdepan di industri. Ubah analisis yang tepat menjadi keyakinan.", image: "analyst.png" }
        ]
    },
    AR: {
        main: "“المعدات القياسية للمستثمرين الذين يحللون العالم.” يدمج TradingView التحليل الفني المتقدم مع موجز اجتماعي عالمي. ارتق بقراراتك مع تقييمات المحللين البديهية وميزات العقول.",
        bonus: "احصل على مكافأة قدرها 15 دولارًا عند التسجيل من خلال هذا الموقع.",
        segments: [
            { id: "beginner", text: "“المعدات القياسية للمستثمرين.” تبسيط تحليل السوق المعقد باستخدام المقياس الفني. حكم على مستوى احترافي، بحدسك.", image: "analyst.png" },
            { id: "intermediate", text: "“المعدات القياسية للمستثمرين.” تزامن مع المستثمرين العالميين في الوقت الفعلي. تنبأ بالمستقبل بذكاء جماعي.", image: "analyst.png" },
            { id: "advanced", text: "“المعدات القياسية للمستثمرين.” تصور كل استراتيجية مع أداء الرسوم البيانية الرائد في الصناعة. حول التحليل الدقيق إلى قناعة.", image: "analyst.png" }
        ]
    },
    FR: {
        main: "L'équipement standard pour les investisseurs analysant le monde. TradingView fusionne l'analyse technique avancée avec un flux social mondial.",
        bonus: "Obtenez un bonus de 15 $ lors de votre inscription via ce site.",
        segments: [
            { id: "beginner", text: "Simplifiez l'analyse de marché complexe avec le indicateur technique. Un jugement de niveau professionnel, intuitivement le vôtre.", image: "analyst.png" },
            { id: "intermediate", text: "Synchronisez avec les investisseurs mondiaux en temps réel. Prédisez l'avenir grâce à l'intelligence collective.", image: "analyst.png" },
            { id: "advanced", text: "Visualisez chaque stratégie avec des performances graphiques de pointe. Transformez l'analyse précise en conviction.", image: "analyst.png" }
        ]
    },
    DE: {
        main: "Die Standardausrüstung für Investoren, die die Welt analysieren. TradingView verbindet fortschrittliche technische Analyse mit einem globalen sozialen Feed.",
        bonus: "Erhalten Sie einen Bonus von 15 $, wenn Sie sich über diese Seite anmelden.",
        segments: [
            { id: "beginner", text: "Vereinfachen Sie komplexe Marktanalysen mit dem technischen Indikator. Urteilsvermögen auf Profi-Niveau, intuitiv für Sie.", image: "analyst.png" },
            { id: "intermediate", text: "Synchronisieren Sie sich in Echtzeit mit globalen Investoren. Sagen Sie die Zukunft mit kollektiver Intelligenz voraus.", image: "analyst.png" },
            { id: "advanced", text: "Visualisieren Sie jede Strategie mit branchenführender Chart-Performance. Verwandeln Sie präzise Analysen in Überzeugung.", image: "analyst.png" }
        ]
    }
};
