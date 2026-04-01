import React, { useState, useEffect } from 'react';
import AnimatedHeartLogo from './components/AnimatedHeartLogo';
import {
  Users,
  Target,
  Heart,
  Shield,
  CheckCircle,
  Star,
  Clock,
  Award,
  ArrowRight,
  X,
  Zap,
  Trophy,
  TrendingUp,
  Play,
  ChevronRight,
  Flame,
  Timer,
  Dumbbell,
  Activity,
  Smile,
  Gift,
  Sparkles
} from 'lucide-react';

function App() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  const [progressBars, setProgressBars] = useState({
    weightLoss: 0,
    recovery: 0,
    mobility: 0,
    community: 0
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progress bar animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressBars({
        weightLoss: 89,
        recovery: 94,
        mobility: 87,
        community: 96
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ProgressBar = ({ progress, label, color }: { progress: number; label: string; color: string }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-2000 ease-out ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  // Comic Book Goal Component
  const ComicGoal = ({ 
    icon: Icon, 
    title, 
    description, 
    color, 
    bgColor, 
    index 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    color: string; 
    bgColor: string; 
    index: number;
  }) => (
    <div 
      className={`relative p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] transform transition-all duration-300 cursor-pointer ${bgColor} ${
        hoveredGoal === index ? 'scale-105 rotate-1' : 'hover:scale-102'
      }`}
      onMouseEnter={() => setHoveredGoal(index)}
      onMouseLeave={() => setHoveredGoal(null)}
    >
      {/* Comic book explosion background */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center transform rotate-12">
        <span className="text-black font-black text-xs">POW!</span>
      </div>
      
      {/* Main icon with animation */}
      <div className={`w-20 h-20 ${color} rounded-full border-4 border-black flex items-center justify-center mx-auto mb-4 ${
        hoveredGoal === index ? 'animate-bounce' : ''
      }`}>
        <Icon className="h-10 w-10 text-white" />
      </div>
      
      {/* Comic book style title */}
      <h3 className="text-2xl font-black text-black mb-3 text-center uppercase tracking-wide transform -skew-x-6">
        {title}
      </h3>
      
      {/* Description with comic styling */}
      <p className="text-black font-bold text-center leading-tight">
        {description}
      </p>
      
      {/* Action lines for dynamic effect */}
      <div className="absolute top-4 left-4 w-8 h-1 bg-black transform -rotate-45 opacity-60"></div>
      <div className="absolute top-6 left-2 w-6 h-1 bg-black transform -rotate-45 opacity-40"></div>
      <div className="absolute bottom-4 right-4 w-8 h-1 bg-black transform rotate-45 opacity-60"></div>
      <div className="absolute bottom-6 right-2 w-6 h-1 bg-black transform rotate-45 opacity-40"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-40 backdrop-blur-md bg-white/95 border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <AnimatedHeartLogo size="md" showText={true} />
              <div className="ml-4 bg-gradient-to-r from-red-600 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                HOLIDAY SALE
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSurvey(true)}
                className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 hover:from-red-700 hover:via-green-700 hover:to-red-700 text-white px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative"
              >
                <Gift className="h-4 w-4 inline mr-2" />
                Get Your Holiday Gift
                <Sparkles className="h-4 w-4 inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Holiday Urgency Banner */}
          <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white text-center py-5 rounded-xl mb-8 animate-pulse relative overflow-hidden shadow-2xl border-4 border-yellow-400">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <Gift className="h-6 w-6 animate-bounce drop-shadow-lg" />
              <Sparkles className="h-5 w-5 drop-shadow-lg" />
              <span className="font-black text-xl drop-shadow-lg">HOLIDAY SPECIAL ENDS IN: {formatTime(timeLeft)}</span>
              <Sparkles className="h-5 w-5 drop-shadow-lg" />
              <Gift className="h-6 w-6 animate-bounce drop-shadow-lg" />
            </div>
            <div className="text-sm mt-2 font-bold relative z-10 drop-shadow-lg">
              Limited Holiday Spots Available - Don't Miss Out on This Season's Gift to Yourself!
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-red-100 via-green-100 to-red-100 text-red-800 px-6 py-3 rounded-full text-sm font-bold mb-6 animate-bounce shadow-lg border-2 border-red-300">
              <Gift className="h-5 w-5 mr-2" />
              Holiday Gift to Yourself - Join Our Growing Health Community!
              <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Give Yourself the Gift of Health This Holiday Season!
              <span className="block text-red-600 mt-2">Your Transformation Starts TODAY</span>
              <span className="block text-green-600 mt-2 text-3xl md:text-4xl">Limited Holiday Special Offer!</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto font-medium">
              Join the most supportive fitness community on the internet. No more struggling alone, 
              no more confusing advice. Just <span className="text-red-600 font-bold">real results</span> with 
              <span className="text-red-600 font-bold"> real people</span> who actually care about your success.
            </p>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-3xl mx-auto shadow-lg border border-red-100">
              <div className="flex items-center justify-center mb-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="ml-4 text-sm text-gray-600">Growing community</span>
              </div>
              <p className="text-lg text-gray-800 italic font-medium">
                "I was tired of being the person who 'starts tomorrow.' This community gave me the 
                accountability I needed to finally stick with it. Down 34 pounds and feeling incredible!"
              </p>
              <p className="text-sm text-gray-600 mt-2">- Sarah M., transformed in 90 days</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => setShowSurvey(true)}
                className="group bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-[0_20px_50px_rgba(220,38,38,0.5)] flex items-center border-2 border-yellow-400"
              >
                <span>🚀 Transform My Life Now</span>
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-700 font-semibold bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Instant access • No equipment needed • Cancel anytime</span>
              </div>
            </div>

            {/* Community Highlights */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto shadow-2xl border-2 border-red-200">
              <div className="text-center">
                <span className="text-base font-bold text-gray-800">Join Our Health Journey</span>
                <div className="mt-3 space-y-2 text-sm font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <span>💪</span>
                    <span>Start your transformation today!</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎉</span>
                    <span>Achieve your health goals!</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔥</span>
                    <span>Be part of something amazing!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comic Book Goals Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 relative overflow-hidden">
        {/* Comic book style background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Comic book style header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-yellow-400 border-4 border-black rounded-2xl px-8 py-4 transform -rotate-2 shadow-[8px_8px_0px_0px_#000] mb-6">
              <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-wider">
                BOOM! Your Goals Await!
              </h2>
            </div>
            <div className="bg-white border-4 border-black rounded-xl px-6 py-3 inline-block transform rotate-1 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-xl font-bold text-black">
                Choose your adventure and CRUSH your fitness goals! 💥
              </p>
            </div>
          </div>
          
          {/* Comic book style goals grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ComicGoal
              icon={Target}
              title="Weight Loss"
              description="SMASH through plateaus and achieve the body you've always wanted!"
              color="bg-red-500"
              bgColor="bg-red-200"
              index={0}
            />
            
            <ComicGoal
              icon={Heart}
              title="Injury Recovery"
              description="BOUNCE BACK stronger than ever with expert recovery strategies!"
              color="bg-blue-500"
              bgColor="bg-blue-200"
              index={1}
            />
            
            <ComicGoal
              icon={Dumbbell}
              title="Strength Building"
              description="POWER UP your muscles and become the strongest version of yourself!"
              color="bg-green-500"
              bgColor="bg-green-200"
              index={2}
            />
            
            <ComicGoal
              icon={Activity}
              title="Mobility Freedom"
              description="UNLEASH your body's potential with improved flexibility and movement!"
              color="bg-purple-500"
              bgColor="bg-purple-200"
              index={3}
            />
          </div>
          
          {/* Comic book style CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 border-4 border-black rounded-2xl px-8 py-6 inline-block transform hover:scale-105 transition-all duration-300 shadow-[8px_8px_0px_0px_#000] cursor-pointer">
              <button 
                onClick={() => setShowSurvey(true)}
                className="text-white font-black text-2xl uppercase tracking-wide"
              >
                🚀 START MY HERO JOURNEY!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features Strip */}
      <section className="bg-gray-900 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <div className="flex items-center group cursor-pointer">
              <Users className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">Growing</span>
                <span className="block text-sm text-gray-300">Community</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <Star className="h-6 w-6 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">4.9/5</span>
                <span className="block text-sm text-gray-300">Success Rate</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <Trophy className="h-6 w-6 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">Daily</span>
                <span className="block text-sm text-gray-300">Goal Achievements</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <TrendingUp className="h-6 w-6 mr-2 text-green-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">23 lbs</span>
                <span className="block text-sm text-gray-300">Average Weight Loss</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Progress Bars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results That Speak For Themselves
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our members don't just dream about change - they achieve it. Here's what our community accomplishes together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-red-50 to-white border-2 border-transparent hover:border-red-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 0 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Target className="h-12 w-12 text-red-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">Weight Loss Mastery</h4>
              <p className="text-gray-600 mb-4">
                Sustainable strategies that work with your lifestyle. No crash diets, no gimmicks.
              </p>
              <ProgressBar progress={progressBars.weightLoss} label="Success Rate" color="bg-red-500" />
              <div className="text-sm text-red-600 font-semibold">
                🔥 Amazing weight loss results!
              </div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-blue-50 to-white border-2 border-transparent hover:border-blue-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 1 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Heart className="h-12 w-12 text-blue-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">Injury Recovery</h4>
              <p className="text-gray-600 mb-4">
                Expert-guided rehabilitation to get you back stronger than before.
              </p>
              <ProgressBar progress={progressBars.recovery} label="Recovery Rate" color="bg-blue-500" />
              <div className="text-sm text-blue-600 font-semibold">
                💪 Incredible recovery success!
              </div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-green-50 to-white border-2 border-transparent hover:border-green-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 2 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Shield className="h-12 w-12 text-green-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">Mobility Freedom</h4>
              <p className="text-gray-600 mb-4">
                Move better, feel younger. Say goodbye to daily aches and stiffness.
              </p>
              <ProgressBar progress={progressBars.mobility} label="Improvement Rate" color="bg-green-500" />
              <div className="text-sm text-green-600 font-semibold">
                🧘‍♀️ Outstanding mobility improvements!
              </div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-white border-2 border-transparent hover:border-purple-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 3 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Users className="h-12 w-12 text-purple-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-3">Community Power</h4>
              <p className="text-gray-600 mb-4">
                24/7 support from people who understand your journey and celebrate your wins.
              </p>
              <ProgressBar progress={progressBars.community} label="Satisfaction Rate" color="bg-purple-500" />
              <div className="text-sm text-purple-600 font-semibold">
                ❤️ Amazing community support!
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowSurvey(true)}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-[0_20px_50px_rgba(220,38,38,0.5)] border-2 border-yellow-400"
            >
              🎯 I Want These Results Too!
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials with Interactive Elements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories That Will Inspire You
            </h3>
            <p className="text-xl text-gray-600">
              Real transformations from real members who started exactly where you are now
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Weight Loss Progress</span>
                  <span className="font-bold text-red-600">-45 lbs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I was skeptical about online communities, but this changed everything. The daily check-ins, 
                the celebration of small wins, the genuine care - it's like having a personal trainer and 
                therapist rolled into thousands of supportive friends!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Lost 45 lbs • Community member</p>
                  <div className="flex items-center mt-1">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 font-medium">Goal Crusher Badge</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Recovery Progress</span>
                  <span className="font-bold text-blue-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "After my knee surgery, I thought my active days were over. The recovery program here 
                didn't just get me walking again - I'm now hiking mountains I never thought I'd see! 
                The community celebrated every small step with me."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Mike R.</p>
                  <p className="text-sm text-gray-500">Full Recovery • Community member</p>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Comeback Champion</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Mobility Improvement</span>
                  <span className="font-bold text-green-600">+85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-5/6 animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "At 62, I'm in the best shape of my life! The mobility work has been life-changing. 
                I can keep up with my grandkids, garden without pain, and feel 20 years younger. 
                This community believes in you even when you don't believe in yourself."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  L
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Linda K.</p>
                  <p className="text-sm text-gray-500">Mobility Master • Community member</p>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 font-medium">Vitality Veteran</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowSurvey(true)}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-[0_20px_50px_rgba(220,38,38,0.5)] flex items-center mx-auto border-2 border-yellow-400"
            >
              <Play className="mr-2 h-6 w-6" />
              Start My Success Story Today
              <ChevronRight className="ml-2 h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Transform Your Life
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs, expert guidance, and a supportive community - all designed to ensure your success
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-red-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">Personalized Fitness Plans</h4>
                    <p className="text-gray-600">Custom workouts that adapt to your fitness level, goals, and available equipment. No cookie-cutter programs here!</p>
                    <div className="mt-2 text-sm text-red-600 font-medium">✨ AI-powered recommendations</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Nutrition That Actually Works</h4>
                    <p className="text-gray-600">Simple, sustainable meal plans that fit your lifestyle. No extreme diets or impossible restrictions.</p>
                    <div className="mt-2 text-sm text-blue-600 font-medium">🍎 Flexible meal planning</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-green-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">24/7 Community Support</h4>
                    <p className="text-gray-600">Never feel alone on your journey. Connect with members and certified coaches anytime you need motivation.</p>
                    <div className="mt-2 text-sm text-green-600 font-medium">💬 Always someone here to help</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-purple-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">Gamified Progress Tracking</h4>
                    <p className="text-gray-600">Earn badges, unlock achievements, and celebrate milestones with tools that make fitness fun and rewarding.</p>
                    <div className="mt-2 text-sm text-purple-600 font-medium">🏆 Level up your fitness game</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-600 transition-colors">Weekly Live Sessions</h4>
                    <p className="text-gray-600">Interactive workshops, Q&As, and group challenges led by fitness experts who actually care about your success.</p>
                    <div className="mt-2 text-sm text-yellow-600 font-medium">📅 Next session: Tomorrow 7PM EST</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-600 via-green-700 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden border-4 border-yellow-400 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              {/* Holiday Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-red-700 font-black text-sm px-6 py-3 rounded-full transform rotate-12 shadow-xl border-4 border-white z-20">
                HOLIDAY SPECIAL
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
                    <Gift className="h-5 w-5 mr-2 animate-bounce" />
                    <span className="font-black">HOLIDAY FLASH ENROLLMENT</span>
                    <Sparkles className="h-5 w-5 ml-2" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Give Yourself the Ultimate Holiday Gift!</h4>
                  <p className="text-yellow-100 font-bold">Limited Holiday Spots - Offer expires in {formatTime(timeLeft)}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Instant Access to All Programs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Personal Success Coach Assigned
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      30-Day Transformation Guarantee
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Exclusive Community Resources
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSurvey(true)}
                  className="w-full bg-white text-red-600 py-5 rounded-full font-black text-xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] mb-4 border-4 border-yellow-400"
                >
                  🚀 Secure My Spot Now
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-red-100 mb-2">
                    ⚡ Instant access • 💳 Secure checkout • 🔒 30-day guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition with Animations */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why The Internet Health Site Changes Everything
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another fitness program. We're the community that believes in your success more than you do.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Users className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-red-400 transition-colors">Community-First Approach</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Unlike other programs that leave you to struggle alone, we provide constant support 
                and encouragement from people who understand your journey because they've walked it too.
              </p>
              <div className="mt-4 text-red-400 font-semibold">
                💪 Growing stronger together
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Target className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">Proven Results System</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Our methods are backed by science and proven by thousands of success stories. 
                No gimmicks, no false promises - just strategies that work in the real world.
              </p>
              <div className="mt-4 text-blue-400 font-semibold">
                📈 4.9/5 success rate
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Shield className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-green-400 transition-colors">Risk-Free Transformation</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                We're so confident in our program that we guarantee your success. If you don't see 
                results in 30 days, we'll refund every penny. Your transformation is our priority.
              </p>
              <div className="mt-4 text-green-400 font-semibold">
                🛡️ 30-day guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-green-700 to-red-600 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-2xl border-2 border-white/30">
              <Gift className="h-6 w-6 mr-2 animate-bounce" />
              <Clock className="h-6 w-6 mr-2" />
              <span className="font-black text-xl">HOLIDAY SPECIAL ENDS: {formatTime(timeLeft)}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              This Holiday Season, Give Yourself the Gift of Transformation!
            </h3>
            <p className="text-xl mb-8 text-red-100 max-w-3xl mx-auto">
              Stop waiting for the "perfect time." Stop making excuses. Stop starting over every Monday. 
              Join our growing community of people who decided TODAY was their day.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">Start Your Journey</div>
              <div className="text-sm text-red-200">Transform Your Life Today</div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="ml-4 text-sm text-red-100">Join others celebrating wins today</span>
            </div>
            <p className="text-red-100 italic">
              "The best time to plant a tree was 20 years ago. The second best time is now." 
              - Your future self will thank you for starting today.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowSurvey(true)}
              className="bg-white text-red-700 px-14 py-6 rounded-full font-black text-2xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-[0_25px_60px_rgba(255,255,255,0.4)] border-4 border-yellow-400"
            >
              🔥 Transform My Life RIGHT NOW
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-red-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-800/30 rounded-lg">
              <p className="text-sm text-red-200 mb-2">
                ⚠️ <strong>Limited Enrollment:</strong> We can only accept a limited number of new members this month to maintain our high-quality support standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-red-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AnimatedHeartLogo size="md" showText={true} />
              <div className="ml-4 bg-gradient-to-r from-red-600 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                HAPPY HOLIDAYS
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming lives through community, support, and proven fitness strategies.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-500">
              <span>🔒 Secure & Private</span>
              <span>•</span>
              <span>💳 Safe Payments</span>
              <span>•</span>
              <span>🎁 Holiday Special Active</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 The Internet Health Site. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Survey Popup */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-2xl transform animate-slideUp border-4 border-gradient-to-r from-red-600 to-green-600 relative flex flex-col">
            {/* Holiday Starburst Badge */}
            <div className="absolute -top-6 -right-6 bg-yellow-400 text-red-700 font-black text-xs px-4 py-2 rounded-full transform rotate-12 shadow-2xl border-4 border-white z-30 animate-pulse">
              HOLIDAY SPECIAL
            </div>

            <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-4 text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <div className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    <h4 className="font-black text-lg">Your Holiday Gift Awaits!</h4>
                    <Sparkles className="h-5 w-5 ml-2" />
                  </div>
                  <p className="text-sm text-yellow-100 font-semibold mt-1">Quick Fitness Assessment - Start Your Transformation</p>
                </div>
                <button
                  onClick={() => setShowSurvey(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">Takes 2 minutes • Get personalized recommendations</span>
                </div>
              </div>
              <div className="min-h-[500px] rounded-lg border-2 border-gray-200 shadow-inner bg-gray-50 overflow-hidden">
                <iframe
                  src="https://safeclick.kenjiai.com/widget/survey/gsjz40C2X5v8Jp29ve2M"
                  style={{border: 'none', width: '100%', minHeight: '500px'}}
                  scrolling="yes"
                  id="gsjz40C2X5v8Jp29ve2M"
                  title="survey"
                />
              </div>
              <div className="mt-4 text-center bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-xs text-gray-700 font-medium flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  Your information is secure and will only be used to personalize your experience
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Survey Script */}
      <script src="https://safeclick.kenjiai.com/js/form_embed.js"></script>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .duration-2000 {
          transition-duration: 2000ms;
        }
      `}</style>
    </div>
  );
}

export default App;