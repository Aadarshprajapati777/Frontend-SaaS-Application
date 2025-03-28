import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/auth-context';
import {
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  File,
  Upload,
  RefreshCw,
  Send,
  Volume2,
  VolumeX,
  X,
  Loader2
} from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * ChatPage Component
 * 
 * A full-featured chatbot interface with:
 * - PDF document upload and interaction via Gemini AI
 * - Voice input (STT) and output (TTS)
 * - Animated circular chatbot UI
 * - Gemini AI integration
 * - Backend integration for storing summaries and generating unique links
 */
export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log('User:', user);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [pdfContent, setPdfContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botAnimationState, setBotAnimationState] = useState('idle'); // idle, listening, speaking, thinking
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState(''); // New state for training status
  const [companyURL, setCompanyURL] = useState(''); // New state for company URL
  const [isTrainingComplete, setIsTrainingComplete] = useState(false); // Flag for training completion
  const [voiceSupport, setVoiceSupport] = useState({
    stt: null,  // null = unknown, true = supported, false = not supported
    tts: null   // null = unknown, true = supported, false = not supported
  });
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Gemini AI setup - Use useMemo to prevent the object from being recreated on every render
  const genAI = useMemo(() => {
    return new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBSrP81JrsaZrrncSqh17Ue3d1yAZsqoQQ');
  }, []);
  
  const modelRef = useRef(null);

  // Customer support SaaS platform context - defined as a constant for consistency - UPDATED for URL generation
  const CUSTOMER_SUPPORT_CONTEXT = `sumarize the document and provide a summary of the document`;

  // Initialize Gemini model
  useEffect(() => {
    try {
      // Initialize the Gemini model with customer support context
      modelRef.current = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: CUSTOMER_SUPPORT_CONTEXT
      });
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize AI model. Please try again.',
        variant: 'destructive',
      });
    }
    
    // Check and initialize Web Speech API
    const checkSpeechSupport = () => {
      // Check for Speech Recognition support
      const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setVoiceSupport(prev => ({ ...prev, stt: hasSpeechRecognition }));
      
      if (hasSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognitionRef.current = new SpeechRecognition();
        speechRecognitionRef.current.continuous = true;
        speechRecognitionRef.current.interimResults = false;
        speechRecognitionRef.current.lang = 'en-US';
        
        speechRecognitionRef.current.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          setInputValue(transcript);
          if (transcript) {
            handleSendMessage(transcript);
          }
        };
        
        speechRecognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setBotAnimationState('idle');
          toast({
            title: 'Speech Recognition Error',
            description: `Error: ${event.error}`,
            variant: 'destructive',
          });
        };
        
        speechRecognitionRef.current.onend = () => {
          if (isListening) {
            // If we're still in listening mode but it stopped, restart it
            speechRecognitionRef.current.start();
          }
        };
      }
      
      // Check for Speech Synthesis support
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      setVoiceSupport(prev => ({ ...prev, tts: hasSpeechSynthesis }));
      
      if (hasSpeechSynthesis) {
        synthesisRef.current = window.speechSynthesis;
        
        // Pre-load voices
        if (synthesisRef.current.getVoices().length === 0) {
          synthesisRef.current.onvoiceschanged = () => {
            // Voices loaded
          };
        }
      }
    };
    
    checkSpeechSupport();
    
    // Cleanup
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
    };
  }, [genAI, isListening]);
  
  // Scroll to bottom of chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (voiceInput = null) => {
    const messageText = voiceInput || inputValue;
    
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setBotAnimationState('thinking');
    
    // Stop listening if active
    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
    
    try {
      // Use the Gemini AI model to generate a response
      if (!modelRef.current) {
        throw new Error("AI model not initialized");
      }
      
      let contents;
      const generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      };
      
      // Handle PDF content for questions
      if (uploadedPdf && pdfContent) {
        // Create a prompt that includes the PDF context for customer support
        const promptWithContext = `sumarize the document and provide a summary of the document`;

        contents = [
          { role: "user", parts: [{ text: promptWithContext }] }
        ];
      } else {
        // No PDF, operate as a standard helpful assistant
        contents = [
          { role: "user", parts: [{ text: `${messageText}` }] }
        ];
      }
      
      // Generate response
      const result = await modelRef.current.generateContent({
        contents,
        generationConfig,
      });
      
      const response = await result.response;
      let responseContent = response.text();
      
      if (!responseContent || responseContent.trim().length === 0) {
        throw new Error("The AI generated an empty response");
      }
      
      // Add bot response to chat
      const botMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Automatically speak the response if voice is enabled
      if (voiceSupport.tts) {
        speakText(responseContent);
      }
      
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        {
          role: 'system',
          content: `Error: ${error.message || 'Failed to get a response from the AI. Please try again.'}`,
          timestamp: new Date(),
          isError: true,
        }
      ]);
      
      toast({
        title: 'AI Response Error',
        description: error.message || 'Failed to get a response from the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setBotAnimationState('idle');
    }
  };
  
  // Process PDF file - Direct Gemini approach with robust error handling and URL generation
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Clear file input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = null;
    }
    
    // Reset previous training state
    setTrainingStatus('');
    setCompanyURL('');
    setIsTrainingComplete(false);
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File Too Large',
        description: 'The PDF file should be less than 10MB.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setPdfProcessing(true);
    setPdfError(null);
    
    try {
      // Set the uploaded PDF file
      setUploadedPdf(file);
      
      // Add system message about upload
      setMessages(prev => [
        ...prev, 
        {
          role: 'system',
          content: `Uploading company documentation: ${file.name}`,
          timestamp: new Date(),
        }
      ]);
      
      // Update training status
      setTrainingStatus('Training in progress...');
      // Set bot animation to training state
      setBotAnimationState('training');
      
      // Use Gemini to process the PDF
      try {
        // Convert file to base64
        const fileBase64 = await readFileAsBase64(file);
        
        // Logging file size for debugging
        console.log(`PDF size: ${Math.round(file.size / 1024)}KB, Base64 length: ${fileBase64.length}`);
        
        // Create a model with appropriate configuration
        const fileModel = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: CUSTOMER_SUPPORT_CONTEXT
        });
        
        // Prepare prompt for the AI - enhanced for customer support context
        const prompt = `
You are operating as part of a customer support SaaS platform.

This PDF document contains company-specific knowledge base information that customers will ask questions about.
Please:
1. Analyze this PDF document thoroughly
2. Extract the key information a customer support agent would need
3. Summarize the document's main topics and content
4. Note any product features, troubleshooting steps, or policies mentioned
5. This information will be used exclusively to answer customer questions

Format your summary in a clear, structured way that would help a support agent quickly understand what information is available in this document.`;
        
        // Send the PDF to Gemini
        const result = await fileModel.generateContent({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { 
                  data: fileBase64, 
                  mimeType: "application/pdf" 
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        });
        
        // Process the response
        const response = await result.response;
        const summary = response.text();
        
        if (!summary || summary.trim().length === 0) {
          throw new Error("The AI couldn't generate a summary of the PDF. The file might be corrupted or have security restrictions.");
        }
        
        // Store the summary
        setPdfContent(summary);
        
        // Get the user ID from auth context - ensure we have a valid user ID
        let userId = 'anonymous';
        
        if (user && user._id) {
          userId = user._id;
        } else {
          // Try to fetch the user data if not already available
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://backend-saas-application.onrender.com'}/api/auth/me`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                if (userData.data && userData.data.id) {
                  userId = userData.data.id;
                }
              }
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
            // Continue with anonymous user ID as fallback
          }
        }
        
        // Store the summary in the backend and get the unique link
        try {
          const backendResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://backend-saas-application.onrender.com'}/api/companies/summary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId,
              fileName: file.name,
              summary
            })
          });
          
          if (!backendResponse.ok) {
            throw new Error(`Failed to store summary in backend: ${backendResponse.statusText}`);
          }
          
          const backendData = await backendResponse.json();
          
          if (!backendData.success) {
            throw new Error(backendData.error || 'Failed to store summary in backend');
          }
          
          // Use the URL from the backend response
          const backendGeneratedURL = `${window.location.origin}${backendData.data.chatbotUrl}`;
          setCompanyURL(backendGeneratedURL);
          
          // Save relevant data to localStorage for cross-app access
          localStorage.setItem(`company_${backendData.data.companyId}_url`, backendGeneratedURL);
          localStorage.setItem(`company_${backendData.data.companyId}_name`, file.name);
          localStorage.setItem(`company_${backendData.data.companyId}_summary`, summary);
          
          console.log('Summary stored in backend successfully:', backendData);
        } catch (backendError) {
          console.error('Error storing summary in backend:', backendError);
          
          // Fall back to local URL generation if backend call fails
          const timestamp = Date.now();
          const uniqueId = Math.random().toString(36).substring(2, 8);
          const fallbackURL = `${window.location.origin}/chatbot/summary/${userId}-${timestamp}-${uniqueId}`;
          setCompanyURL(fallbackURL);
          
          // Add a warning message
          setMessages(prev => [
            ...prev, 
            {
              role: 'system',
              content: `Warning: Could not save to server. Using local URL instead: ${fallbackURL}`,
              timestamp: new Date(),
              isError: true,
            }
          ]);
        }
        
        // Set training status to complete
        setTrainingStatus('Training completed successfully.');
        setIsTrainingComplete(true);
        
        // Add success message
        setMessages(prev => [
          ...prev, 
          {
            role: 'system',
            content: `Company knowledge base processed successfully: ${file.name}`,
            timestamp: new Date(),
          }
        ]);
        
        // Add the summary from Gemini with training completion message
        setMessages(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: `I've analyzed your company documentation "${file.name}" and completed training on your data. I'm ready to provide customer support based exclusively on this information.\n\n${summary}\n\nYour company's unique support URL has been generated: ${companyURL}`,
            timestamp: new Date(),
          }
        ]);
        
        toast({
          title: 'Knowledge Base Ready',
          description: `${file.name} has been processed. The chatbot will now answer based on this document.`,
        });
        
      } catch (error) {
        // Log detailed error for debugging
        console.error('Gemini PDF processing error:', error);
        console.error('Error details:', error.message);
        
        // Reset training status
        setTrainingStatus('');
        setIsTrainingComplete(false);
        
        let errorMessage = 'Failed to process the company documentation with Gemini AI.';
        
        // Check for specific error types
        if (error.message?.includes('RESOURCE_EXHAUSTED')) {
          errorMessage = 'The PDF file is too large or complex for the AI to process.';
        } else if (error.message?.includes('INVALID_ARGUMENT')) {
          errorMessage = 'The PDF format is not supported or the file might be corrupted.';
        } else if (error.message?.includes('PERMISSION_DENIED')) {
          errorMessage = 'The PDF may be password protected or have security restrictions.';
        } else if (error.message?.includes('UNAUTHENTICATED')) {
          errorMessage = 'API authentication failed. Please check your API key.';
        }
        
        setPdfError(errorMessage);
        
        // Add error message to chat
        setMessages(prev => [
          ...prev, 
          {
            role: 'system',
            content: `Error processing company documentation: ${errorMessage}`,
            timestamp: new Date(),
            isError: true,
          }
        ]);
        
        toast({
          title: 'Document Processing Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
    } catch (error) {
      console.error('General file handling error:', error);
      setPdfError('Failed to handle the PDF file');
      
      // Reset training status
      setTrainingStatus('');
      setIsTrainingComplete(false);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          role: 'system',
          content: `Error processing documentation: ${error.message || 'Unknown error'}`,
          timestamp: new Date(),
          isError: true,
        }
      ]);
      
      toast({
        title: 'Document Processing Error',
        description: 'Failed to process the PDF file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setPdfProcessing(false);
    }
  };
  
  // Improved helper function to read file as base64
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = () => {
          try {
            // Get the base64 string
            const base64String = reader.result.split(',')[1];
            if (!base64String) {
              reject(new Error("Failed to convert file to base64"));
              return;
            }
            resolve(base64String);
          } catch (err) {
            reject(err);
          }
        };
        
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(new Error("FileReader error: " + (error.message || "Unknown error")));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("readFileAsBase64 error:", error);
        reject(error);
      }
    });
  };
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (!voiceSupport.stt || !speechRecognitionRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      setBotAnimationState('idle');
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
        setBotAnimationState('listening');
        toast({
          title: 'Listening...',
          description: 'Speak now to send a message.',
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: 'Error',
          description: 'Failed to start speech recognition. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Text-to-speech for bot responses
  const speakText = (text) => {
    if (!voiceSupport.tts || !synthesisRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Text-to-speech is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    // Cancel if already speaking
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      setBotAnimationState('idle');
      return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a good voice if available
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Premium') || 
      voice.name.includes('Enhanced')
    ) || voices.find(voice => voice.lang === 'en-US');
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setBotAnimationState('speaking');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setBotAnimationState('idle');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setIsSpeaking(false);
      setBotAnimationState('idle');
    };
    
    synthesisRef.current.speak(utterance);
  };
  
  // Handle file upload click
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Clear the chat
  const handleClearChat = () => {
    setMessages([]);
    setUploadedPdf(null);
    setPdfContent('');
    setPdfError(null);
    toast({
      title: 'Chat Cleared',
      description: 'The conversation has been cleared.',
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  // Toggle text-to-speech
  const toggleSpeaking = () => {
    if (!voiceSupport.tts) {
      toast({
        title: 'Not Supported',
        description: 'Text-to-speech is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    if (synthesisRef.current && synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      setBotAnimationState('idle');
    } else if (messages.length > 0) {
      // Find the last assistant message
      const lastBotMessage = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastBotMessage) {
        speakText(lastBotMessage.content);
      }
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render chat messages
  const renderMessages = () => {
    return messages.map((message, index) => {
      // System messages (like PDF upload notifications)
      if (message.role === 'system') {
        return (
          <Motion.div 
            key={index} 
            className="flex justify-center my-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`px-3 py-1 rounded-full text-sm ${message.isError ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
              {message.content}
            </div>
          </Motion.div>
        );
      }
      
      // User messages
      if (message.role === 'user') {
        return (
          <Motion.div 
            key={index} 
            className="flex justify-end mb-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mr-2 py-3 px-4 bg-indigo-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-md">
              {message.content}
              <div className="text-xs text-right mt-1 text-indigo-200">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </Motion.div>
        );
      }
      
      // Assistant messages
      return (
        <Motion.div 
          key={index} 
          className="flex mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="ml-2 py-3 px-4 bg-gray-200 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-gray-800 max-w-md">
            {message.content}
            <div className="text-xs text-right mt-1 text-gray-500">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </Motion.div>
      );
    });
  };

  // Animated bot variations based on state - enhanced for customer support SaaS
  const botAnimations = {
    idle: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 10px rgba(99, 102, 241, 0.4)",
        "0 0 20px rgba(99, 102, 241, 0.6)",
        "0 0 10px rgba(99, 102, 241, 0.4)"
      ],
      opacity: 0.9,
      transition: { 
        duration: 3, 
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    listening: {
      scale: [1, 1.2, 1],
      borderRadius: ["50%", "40%", "50%"],
      backgroundColor: ["#6366f1", "#4f46e5", "#6366f1"],
      boxShadow: [
        "0 0 0 0 rgba(99, 102, 241, 0.7)",
        "0 0 0 10px rgba(99, 102, 241, 0.3)",
        "0 0 0 0 rgba(99, 102, 241, 0.7)"
      ],
      transition: { 
        duration: 1.5, 
        repeat: Infinity 
      }
    },
    speaking: {
      scale: [1, 1.1, 1, 1.1, 1],
      rotate: [0, 1, 0, -1, 0],
      boxShadow: [
        "0 0 0 0 rgba(79, 70, 229, 0.4)",
        "0 0 0 5px rgba(79, 70, 229, 0.2)",
        "0 0 0 0 rgba(79, 70, 229, 0.4)"
      ],
      transition: { 
        duration: 0.8, 
        repeat: Infinity 
      }
    },
    thinking: {
      rotate: [0, 180, 360],
      opacity: [0.7, 1, 0.7],
      boxShadow: [
        "0 0 0 0 rgba(99, 102, 241, 0.4)",
        "0 0 0 8px rgba(99, 102, 241, 0.2)",
        "0 0 0 0 rgba(99, 102, 241, 0.4)"
      ],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        ease: "linear"
      }
    },
    // New animation state for when company documentation is loaded
    knowledgeReady: {
      scale: [1, 1.15, 1],
      backgroundColor: ["#4f46e5", "#10B981", "#4f46e5"],
      boxShadow: [
        "0 0 10px rgba(16, 185, 129, 0.4)",
        "0 0 30px rgba(16, 185, 129, 0.7)",
        "0 0 10px rgba(16, 185, 129, 0.4)"
      ],
      transition: { 
        duration: 3, 
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    // New animation state for when the bot is training on the PDF
    training: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
      backgroundColor: ["#4f46e5", "#3730a3", "#4f46e5"],
      boxShadow: [
        "0 0 10px rgba(99, 102, 241, 0.4)",
        "0 0 20px rgba(99, 102, 241, 0.8)",
        "0 0 10px rgba(99, 102, 241, 0.4)"
      ],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  // Effect to change bot animation state when PDF is loaded or training is complete
  useEffect(() => {
    if (isTrainingComplete && !isLoading && !isListening && !isSpeaking) {
      // When training is complete, show the knowledgeReady state
      setBotAnimationState('knowledgeReady');
    } else if (uploadedPdf && pdfContent && !isLoading && !isListening && !isSpeaking) {
      // If we have a PDF loaded and the bot is idle, show the knowledgeReady state
      setBotAnimationState('knowledgeReady');
    } else if (!isLoading && !isListening && !isSpeaking) {
      // Otherwise, if the bot is not doing anything else, set to idle
      setBotAnimationState('idle');
    }
  }, [uploadedPdf, pdfContent, isLoading, isListening, isSpeaking, isTrainingComplete]);
  
  // Particle animation for the background
  const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10
    }));
  };
  
  const particles = useMemo(() => generateParticles(15), []);
  
  // Copy URL to clipboard
  const copyURLToClipboard = () => {
    if (!companyURL) return;
    
    navigator.clipboard.writeText(companyURL)
      .then(() => {
        toast({
          title: 'URL Copied',
          description: 'The unique support URL has been copied to your clipboard.',
        });
      })
      .catch((error) => {
        console.error('Failed to copy URL:', error);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy the URL. Please try again.',
          variant: 'destructive',
        });
      });
  };
  
  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <Motion.div
            key={particle.id}
            className="absolute rounded-full bg-indigo-500/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <Motion.div 
        className="bg-white shadow-sm p-4 flex justify-between items-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <Motion.h1 
            className="text-xl font-bold text-gray-900 flex items-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Motion.span
              className="inline-block mr-2"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
            >
              <Bot className="h-6 w-6 text-indigo-500 mr-2" />
            </Motion.span>
            AI Chat Assistant
          </Motion.h1>
          
          {uploadedPdf && (
            <Motion.div 
              className="ml-4 flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <File className="h-4 w-4 mr-1" />
              {uploadedPdf.name}
              <button 
                onClick={() => {
                  setUploadedPdf(null);
                  setPdfContent('');
                }}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </Motion.div>
          )}
          
          {pdfProcessing && (
            <Motion.div 
              className="ml-3 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500 mr-1" />
              <span className="text-xs text-indigo-500">Processing PDF...</span>
            </Motion.div>
          )}
          
          {isTrainingComplete && (
            <Motion.div 
              className="ml-3 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Motion.span
                className="inline-block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: 1 }}
              >
                ✓
              </Motion.span>
              <span className="ml-1">Training Complete</span>
            </Motion.div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
          >
            Clear Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            Back Home
          </Button>
        </div>
      </Motion.div>
      
      {/* Main Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-auto p-4 pb-28 bg-gray-50 relative"
      >
        {/* PDF Training Overlay */}
        {trainingStatus && trainingStatus.includes('progress') && (
          <Motion.div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Motion.div 
              className="bg-white rounded-lg p-6 shadow-xl max-w-md text-center"
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Motion.div
                className="w-16 h-16 rounded-full bg-indigo-500 mx-auto mb-4 flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(99, 102, 241, 0.7)",
                    "0 0 0 10px rgba(99, 102, 241, 0.3)",
                    "0 0 0 0 rgba(99, 102, 241, 0.7)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Bot className="h-8 w-8 text-white" />
              </Motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Training in Progress</h3>
              <p className="text-gray-600 mb-4">
                Analyzing and training AI on your company documentation. This may take a moment depending on document size.
              </p>
              <Motion.div 
                className="w-full bg-gray-200 rounded-full h-2 mb-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5 }}
              >
                <Motion.div 
                  className="bg-indigo-500 h-2 rounded-full"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </Motion.div>
              <p className="text-sm text-gray-500">
                Once complete, you'll receive a unique URL for integrating this custom-trained chatbot.
              </p>
            </Motion.div>
          </Motion.div>
        )}
        
        {messages.length === 0 ? (
          <Motion.div 
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <Bot className="h-20 w-20 text-indigo-300 mb-4" />
            </Motion.div>
            <Motion.h2 
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Customer Support AI Assistant
            </Motion.h2>
            <Motion.p 
              className="text-gray-600 mb-6 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Upload your company documentation to train the AI on your specific content. Your customers will receive accurate support based exclusively on your knowledge base. After training, you'll receive a unique URL for integrating the chatbot into your existing systems.
            </Motion.p>
            <Motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                onClick={handleFileButtonClick}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                disabled={pdfProcessing}
              >
                {pdfProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Company Documentation
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setInputValue("What can you help me with?");
                  handleSendMessage("What can you help me with?");
                }}
                disabled={isLoading}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </Motion.div>
          </Motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {renderMessages()}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Circular Animated Bot */}
      <Motion.div 
        className="absolute left-1/2 bottom-24 transform -translate-x-1/2 z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
      >
        <Motion.div
          className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg cursor-pointer"
          variants={botAnimations}
          animate={botAnimationState}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSpeaking}
        >
          <Bot className="h-8 w-8 text-white" />
        </Motion.div>
      </Motion.div>
      
      {/* PDF content indicator */}
      {uploadedPdf && pdfContent && (
        <Motion.div
          className="absolute bottom-24 right-4 bg-green-100 rounded-full px-3 py-1 text-xs text-green-800 flex items-center shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <File className="h-3 w-3 mr-1" />
          Knowledge Base Active
        </Motion.div>
      )}
      
      {/* Training status and company URL display */}
      {isTrainingComplete && (
        <Motion.div
          className="absolute bottom-32 right-4 left-4 md:left-auto md:right-4 md:w-72 bg-white rounded-lg p-3 shadow-lg border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm font-medium text-green-600 mb-1">
            {trainingStatus}
          </div>
          {companyURL && (
            <div className="mt-2 text-xs">
              <div className="text-gray-600 mb-1">Your company's unique support URL:</div>
              <div className="flex items-center gap-2">
                <a 
                  href={companyURL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 break-all font-medium flex-1"
                >
                  {companyURL}
                </a>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 w-6 p-0" 
                  onClick={copyURLToClipboard}
                  title="Copy URL to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </Button>
              </div>
              <div className="mt-2 text-gray-500 text-xs">
                Share this URL with your team to access the customer support interface trained on your documentation.
              </div>
            </div>
          )}
        </Motion.div>
      )}
      
      {/* Input Area */}
      <Motion.div 
        className="bg-white border-t p-4 relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              className="hidden"
            />
            
            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleFileButtonClick}
                disabled={isLoading || pdfProcessing}
                title="Upload PDF"
                className="relative"
              >
                {pdfProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                
                {pdfError && (
                  <Motion.span 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </Button>
            </Motion.div>
            
            <Motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className={!voiceSupport.stt ? 'opacity-50' : ''}
            >
              <Button
                type="button"
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={toggleListening}
                disabled={isLoading || !voiceSupport.stt}
                className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </Motion.div>
            
            <Motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className={!voiceSupport.tts ? 'opacity-50' : ''}
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={toggleSpeaking}
                disabled={isLoading || messages.length === 0 || !voiceSupport.tts}
                className={isSpeaking ? "bg-indigo-500 text-white" : ""}
                title={isSpeaking ? "Stop Speaking" : "Speak Last Response"}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </Motion.div>
            
            <div className="flex-grow relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || isListening}
                className="pr-10"
              />
              <AnimatePresence>
                {isListening && (
                  <Motion.div 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit" 
                disabled={isLoading || inputValue.trim() === '' || isListening}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </Motion.div>
          </form>
          
          {uploadedPdf && (
            <Motion.div 
              className="mt-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              PDF loaded: {uploadedPdf.name} ({Math.round(uploadedPdf.size / 1024)} KB) 
              {pdfContent ? (
                <span className="text-green-500 ml-1">• Content extracted successfully</span>
              ) : pdfError ? (
                <span className="text-red-500 ml-1">• {pdfError}</span>
              ) : null}
            </Motion.div>
          )}
        </div>
      </Motion.div>
    </div>
  );
}
