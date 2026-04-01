import { useState, useEffect } from 'react';
import AnimatedHeartLogo from './components/AnimatedHeartLogo';
import { getHolidayTheme } from './utils/holidayTheme';
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
  Dumbbell,
  Activity,
  Gift,
  Sparkles
} from 'lucide-react';

function App() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  const [progressBars, setProgressBars] = useState({
    weightLoss: 0,
    recovery: 0,
    mobility: 0,
    community: 0
  });

  const theme = getHolidayTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center transform rotate-12">
        <span className="text-black font-black text-xs">POW!</span>
      </div>
      <div className={`w-20 h-20 ${color} rounded-full border-4 border-black flex items-center justify-center mx-auto mb-4 ${
        hoveredGoal === index ? 'animate-bounce' : ''
      }`}>
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h3 className="text-2xl font-black text-black mb-3 text-center uppercase tracking-wide transform -skew-x-6">
        {title}
      </h3>
      <p className="text-black font-bold text-center leading-tight">
        {description}
      </p>
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
              <div className={`ml-4 bg-gradient-to-r ${theme.gradient} text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse`}>
                {theme.headerBadge}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSurvey(true)}
                className={`bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} text-white px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative`}
              >
                <span className="mr-2">{theme.emoji}</span>
                {theme.giftText}
                <Sparkles className="h-4 w-4 inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`pt-20 pb-16 bg-gradient-to-br ${theme.bgLight} relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Urgency Banner */}
          <div className={`bg-gradient-to-r ${theme.gradient} text-white text-center py-5 rounded-xl mb-8 animate-pulse relative overflow-hidden shadow-2xl border-4 border-yellow-400`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <span className="text-xl">{theme.emoji}</span>
              <Sparkles className="h-5 w-5 drop-shadow-lg" />
              <span className="font-black text-xl drop-shadow-lg">{theme.urgencyText} {formatTime(timeLeft)}</span>
              <Sparkles className="h-5 w-5 drop-shadow-lg" />
              <span className="text-xl">{theme.secondaryEmoji}</span>
            </div>
            <div className="text-sm mt-2 font-bold relative z-10 drop-shadow-lg">
              Limited Spots Available — Don't Miss Your Chance to Transform!
            </div>
          </div>

          <div className="text-center">
            {/* Internet Health Club Badge */}
            <div className={`inline-flex items-center bg-gradient-to-r ${theme.badgeGradient} ${theme.accentColor} px-6 py-3 rounded-full text-sm font-bold mb-6 animate-bounce shadow-lg border-2 ${theme.borderAccent}`}>
              <Heart className="h-5 w-5 mr-2" />
              Members of The Internet Health Site Now Enjoy Complementary Internet Health Club Access!
              <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {theme.heroHeadline}
              <span className={`block ${theme.accentColor} mt-2`}>Your Transformation Starts TODAY</span>
              <span className={`block ${theme.accentColor} mt-2 text-3xl md:text-4xl`}>{theme.heroSubline}</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto font-medium">
              Members of <span className={`${theme.accentColor} font-bold`}>The Internet Health Site</span> now enjoy 
              <span className={`${theme.accentColor} font-bold`}> complementary membership</span> in the 
              <span className={`${theme.accentColor} font-bold`}> Internet Health Club</span> — which delivers 
              step-by-step remote guidance into the path of designing your figure.
            </p>

            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              No more struggling alone. No more confusing advice. Just <span className={`${theme.accentColor} font-bold`}>real results</span> with 
              <span className={`${theme.accentColor} font-bold`}> real people</span> who actually care about your success — 
              and a proven remote coaching system that designs your body from anywhere.
            </p>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-3xl mx-auto shadow-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold border-2 border-white`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="ml-4 text-sm text-gray-600">Growing community of transformers</span>
              </div>
              <p className="text-lg text-gray-800 italic font-medium">
                "I was tired of being the person who 'starts tomorrow.' The Internet Health Club gave me a real coach,
                a real plan, and real accountability. Down 34 pounds and feeling incredible — all from home!"
              </p>
              <p className="text-sm text-gray-600 mt-2">- Sarah M., transformed in 90 days with remote coaching</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => setShowSurvey(true)}
                className={`group bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center border-2 border-yellow-400`}
              >
                <span>{theme.ctaPrimary}</span>
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-700 font-semibold bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Instant access • Remote coaching • Cancel anytime</span>
              </div>
            </div>

            {/* Internet Health Club Value Prop */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto shadow-2xl border-2 border-gray-200">
              <div className="text-center">
                <span className="text-base font-bold text-gray-800">Your Internet Health Club Membership Includes:</span>
                <div className="mt-3 space-y-2 text-sm font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <span>💪</span>
                    <span>Step-by-step remote figure design guidance</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎯</span>
                    <span>Personal coach assigned to your journey</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔥</span>
                    <span>Custom workout & nutrition plans from home</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🤝</span>
                    <span>24/7 community support & accountability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comic Book Goals Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-block bg-yellow-400 border-4 border-black rounded-2xl px-8 py-4 transform -rotate-2 shadow-[8px_8px_0px_0px_#000] mb-6">
              <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-wider">
                BOOM! Your Goals Await!
              </h2>
            </div>
            <div className="bg-white border-4 border-black rounded-xl px-6 py-3 inline-block transform rotate-1 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-xl font-bold text-black">
                The Internet Health Club designs YOUR figure remotely — pick your path! 💥
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ComicGoal
              icon={Target}
              title="Weight Loss"
              description="Your remote coach designs a fat-burning plan tailored to YOUR body — no guesswork!"
              color="bg-red-500"
              bgColor="bg-red-200"
              index={0}
            />
            <ComicGoal
              icon={Heart}
              title="Injury Recovery"
              description="Step-by-step remote rehab guidance to bounce back stronger than ever!"
              color="bg-blue-500"
              bgColor="bg-blue-200"
              index={1}
            />
            <ComicGoal
              icon={Dumbbell}
              title="Strength Building"
              description="Build lean muscle from anywhere with expert-designed remote training programs!"
              color="bg-green-500"
              bgColor="bg-green-200"
              index={2}
            />
            <ComicGoal
              icon={Activity}
              title="Mobility Freedom"
              description="Remote flexibility coaching that unlocks your body's full range of motion!"
              color="bg-purple-500"
              bgColor="bg-purple-200"
              index={3}
            />
          </div>
          
          <div className="text-center mt-16">
            <div className={`bg-gradient-to-r ${theme.gradient} border-4 border-black rounded-2xl px-8 py-6 inline-block transform hover:scale-105 transition-all duration-300 shadow-[8px_8px_0px_0px_#000] cursor-pointer`}>
              <button 
                onClick={() => setShowSurvey(true)}
                className="text-white font-black text-2xl uppercase tracking-wide"
              >
                {theme.ctaPrimary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features Strip */}
      <section className="bg-gray-900 text-white py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <div className="flex items-center group cursor-pointer">
              <Users className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">Growing</span>
                <span className="block text-sm text-gray-300">Health Club Members</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <Star className="h-6 w-6 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">4.9/5</span>
                <span className="block text-sm text-gray-300">Member Success Rate</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <Trophy className="h-6 w-6 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">Remote</span>
                <span className="block text-sm text-gray-300">Figure Design Coaching</span>
              </div>
            </div>
            <div className="flex items-center group cursor-pointer">
              <TrendingUp className="h-6 w-6 mr-2 text-green-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-xl">23 lbs</span>
                <span className="block text-sm text-gray-300">Average Member Weight Loss</span>
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
              Real Results from Real Members — All Achieved Remotely
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Internet Health Club members don't just dream about change — they achieve it with step-by-step remote guidance that designs their figure from anywhere in the world.
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
              </div>
              <h4 className="text-xl font-semibold mb-3">Remote Weight Loss</h4>
              <p className="text-gray-600 mb-4">
                Your personal coach designs a sustainable fat-loss plan you follow from home. No gym required.
              </p>
              <ProgressBar progress={progressBars.weightLoss} label="Success Rate" color="bg-red-500" />
              <div className="text-sm text-red-600 font-semibold">🔥 89% achieve their goal weight</div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-blue-50 to-white border-2 border-transparent hover:border-blue-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 1 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Heart className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Remote Recovery</h4>
              <p className="text-gray-600 mb-4">
                Step-by-step guided rehab delivered remotely. Come back stronger without leaving your home.
              </p>
              <ProgressBar progress={progressBars.recovery} label="Recovery Rate" color="bg-blue-500" />
              <div className="text-sm text-blue-600 font-semibold">💪 94% full recovery rate</div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-green-50 to-white border-2 border-transparent hover:border-green-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 2 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Shield className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Remote Mobility</h4>
              <p className="text-gray-600 mb-4">
                Remote coaching that unlocks pain-free movement. Feel 20 years younger from your living room.
              </p>
              <ProgressBar progress={progressBars.mobility} label="Improvement Rate" color="bg-green-500" />
              <div className="text-sm text-green-600 font-semibold">🧘‍♀️ 87% pain reduction</div>
            </div>
            
            <div 
              className={`text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-white border-2 border-transparent hover:border-purple-200 transition-all duration-300 transform hover:scale-105 cursor-pointer ${hoveredCard === 3 ? 'shadow-xl' : 'shadow-lg'}`}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative mb-4">
                <Users className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Club Community</h4>
              <p className="text-gray-600 mb-4">
                24/7 support from fellow members and coaches who celebrate every small win with you.
              </p>
              <ProgressBar progress={progressBars.community} label="Satisfaction Rate" color="bg-purple-500" />
              <div className="text-sm text-purple-600 font-semibold">❤️ 96% member satisfaction</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowSurvey(true)}
              className={`bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl border-2 border-yellow-400`}
            >
              🎯 I Want These Results Too — From Home!
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Internet Health Club Success Stories
            </h3>
            <p className="text-xl text-gray-600">
              Real transformations from real members — all achieved remotely with their personal figure-design coach
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Remote Weight Loss Progress</span>
                  <span className="font-bold text-red-600">-45 lbs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I never believed remote coaching could work until I joined the Internet Health Club. My coach designed every workout and meal plan specifically for me. Down 45 lbs without ever stepping into a gym. This community changed my life!"
              </p>
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>S</div>
                <div className="ml-3">
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Lost 45 lbs • Remote coaching member</p>
                  <div className="flex items-center mt-1">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 font-medium">Figure Design Champion</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Remote Recovery Progress</span>
                  <span className="font-bold text-blue-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "After my knee surgery, I thought my active days were over. The remote recovery program gave me step-by-step guidance from home. Now I'm hiking mountains I never thought I'd see — and my coach celebrated every single step!"
              </p>
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>M</div>
                <div className="ml-3">
                  <p className="font-semibold">Mike R.</p>
                  <p className="text-sm text-gray-500">Full Recovery • Remote coaching member</p>
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
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Remote Mobility Improvement</span>
                  <span className="font-bold text-green-600">+85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "At 62, I'm in the best shape of my life — all from following my remote coach's plan at home. I can keep up with my grandkids, garden without pain, and feel 20 years younger. The Internet Health Club believes in you!"
              </p>
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg`}>L</div>
                <div className="ml-3">
                  <p className="font-semibold">Linda K.</p>
                  <p className="text-sm text-gray-500">Mobility Master • Remote coaching member</p>
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
              className={`bg-gradient-to-r ${theme.gradient} ${theme.gradientHover} text-white px-10 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center mx-auto border-2 border-yellow-400`}
            >
              <Play className="mr-2 h-6 w-6" />
              Start My Remote Transformation
              <ChevronRight className="ml-2 h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Internet Health Club Membership — Everything Included
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complementary with your Internet Health Site membership. Step-by-step remote guidance to design the figure you've always wanted.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-red-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">Personal Figure Design Coach</h4>
                    <p className="text-gray-600">A dedicated remote coach who creates YOUR custom plan — workouts, nutrition, and accountability. Not a cookie-cutter program.</p>
                    <div className="mt-2 text-sm text-red-600 font-medium">✨ 1-on-1 remote coaching included</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Step-by-Step Remote Guidance</h4>
                    <p className="text-gray-600">Follow-along video workouts, daily check-ins, and meal plans delivered straight to your phone. Transform from anywhere.</p>
                    <div className="mt-2 text-sm text-blue-600 font-medium">📱 All from your phone or laptop</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-green-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">24/7 Health Club Community</h4>
                    <p className="text-gray-600">Never feel alone. Connect with fellow members and certified coaches anytime you need motivation, answers, or a high-five.</p>
                    <div className="mt-2 text-sm text-green-600 font-medium">💬 Always someone here to help</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-purple-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">Gamified Progress Tracking</h4>
                    <p className="text-gray-600">Earn badges, unlock achievements, and celebrate milestones. Your coach tracks everything so you see exactly how far you've come.</p>
                    <div className="mt-2 text-sm text-purple-600 font-medium">🏆 Level up your fitness game</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-600 transition-colors">Weekly Live Coaching Sessions</h4>
                    <p className="text-gray-600">Interactive workshops, Q&As, and group challenges led by fitness experts who actually care about your success.</p>
                    <div className="mt-2 text-sm text-yellow-600 font-medium">📅 Live sessions every week</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 text-white relative overflow-hidden border-4 border-yellow-400 shadow-2xl`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 font-black text-sm px-6 py-3 rounded-full transform rotate-12 shadow-xl border-4 border-white z-20">
                {theme.headerBadge}
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
                    <span className="mr-2">{theme.emoji}</span>
                    <span className="font-black">{theme.name.toUpperCase()} FLASH ENROLLMENT</span>
                    <Sparkles className="h-5 w-5 ml-2" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Complementary Health Club Membership!</h4>
                  <p className="text-yellow-100 font-bold">Limited spots — Offer expires in {formatTime(timeLeft)}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Personal Remote Figure Design Coach</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Step-by-Step Guidance from Home</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>30-Day Transformation Guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Exclusive Health Club Community</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSurvey(true)}
                  className="w-full bg-white text-gray-900 py-5 rounded-full font-black text-xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 shadow-2xl mb-4 border-4 border-yellow-400"
                >
                  {theme.ctaPrimary}
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-white/80 mb-2">
                    ⚡ Instant access • 💳 Secure checkout • 🔒 30-day guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why The Internet Health Club Changes Everything
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another fitness program. We deliver step-by-step remote guidance into the path of designing YOUR figure — with a community that believes in your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Users className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-red-400 transition-colors">Remote Coaching That Works</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Your personal coach is just a message away. They design your workouts, your meals, and your recovery — all remotely, all personalized. No gym membership required.
              </p>
              <div className="mt-4 text-red-400 font-semibold">
                💪 1-on-1 remote guidance
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Target className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">Proven Figure Design System</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Our step-by-step system has been proven by thousands of members. No gimmicks, no false promises — just a proven remote pathway to the body you want.
              </p>
              <div className="mt-4 text-blue-400 font-semibold">
                📈 4.9/5 member success rate
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Shield className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-green-400 transition-colors">Risk-Free Transformation</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                We're so confident in our remote coaching system that we guarantee your results. If you don't see progress in 30 days, we'll refund every penny.
              </p>
              <div className="mt-4 text-green-400 font-semibold">
                🛡️ 30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`py-20 bg-gradient-to-r ${theme.gradient} text-white relative overflow-hidden shadow-2xl`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-2xl border-2 border-white/30">
              <span className="text-xl mr-2">{theme.emoji}</span>
              <Clock className="h-6 w-6 mr-2" />
              <span className="font-black text-xl">{theme.urgencyText} {formatTime(timeLeft)}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Your Complementary Internet Health Club Membership Is Waiting
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Members of The Internet Health Site now enjoy complementary membership in the Internet Health Club — 
              step-by-step remote guidance into the path of designing your figure. Stop waiting. Start designing.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">Start Your Remote Figure Design</div>
              <div className="text-sm opacity-80">Join the Internet Health Club — Transform from Anywhere</div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="ml-4 text-sm opacity-80">Members celebrating wins today</span>
            </div>
            <p className="italic opacity-80">
              "The best time to start was yesterday. The second best time is now." 
              — Your future self will thank you for joining the Internet Health Club today.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowSurvey(true)}
              className="bg-white text-gray-900 px-14 py-6 rounded-full font-black text-2xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-110 shadow-2xl border-4 border-yellow-400"
            >
              {theme.ctaSecondary}
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm opacity-80">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-4 w-4 mr-2" />
                <span>Complementary Membership</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-black/20 rounded-lg">
              <p className="text-sm opacity-80 mb-2">
                ⚠️ <strong>Limited Enrollment:</strong> We can only accept a limited number of new Health Club members this month to maintain our high-quality remote coaching standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-gray-900 text-white py-12 border-t-4 shadow-2xl`} style={{ borderColor: 'currentColor' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AnimatedHeartLogo size="md" showText={true} />
              <div className={`ml-4 bg-gradient-to-r ${theme.gradient} text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse`}>
                {theme.footerBadge}
              </div>
            </div>
            <p className="text-gray-400 mb-2 font-semibold">
              The Internet Health Site × Internet Health Club
            </p>
            <p className="text-gray-500 mb-4 text-sm">
              Step-by-step remote guidance into the path of designing your figure. Complementary for all members.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-500">
              <span>🔒 Secure & Private</span>
              <span>•</span>
              <span>💳 Safe Payments</span>
              <span>•</span>
              <span>{theme.emoji} {theme.headerBadge} Active</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} The Internet Health Site. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Survey Popup */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-2xl transform animate-slideUp relative flex flex-col">
            <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 font-black text-xs px-4 py-2 rounded-full transform rotate-12 shadow-2xl border-4 border-white z-30 animate-pulse">
              {theme.headerBadge}
            </div>

            <div className={`bg-gradient-to-r ${theme.gradient} p-4 text-white relative overflow-hidden shadow-lg rounded-t-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <div className="flex items-center">
                    <span className="mr-2">{theme.emoji}</span>
                    <h4 className="font-black text-lg">{theme.surveyHeading}</h4>
                    <Sparkles className="h-5 w-5 ml-2" />
                  </div>
                  <p className="text-sm opacity-80 font-semibold mt-1">Quick Assessment — Design Your Figure</p>
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
                  <span className="font-semibold">Takes 2 minutes • Get your personalized figure design plan</span>
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
                  Your information is secure and will only be used to personalize your Health Club experience
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <script src="https://safeclick.kenjiai.com/js/form_embed.js"></script>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .duration-2000 { transition-duration: 2000ms; }
      `}</style>
    </div>
  );
}

export default App;