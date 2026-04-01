import { useState, useEffect } from 'react';
import AnimatedHeartLogo from './components/AnimatedHeartLogo';
import { getHolidayTheme } from './utils/holidayTheme';
import { SocialProofToast } from './components/SocialProofToast';
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
              If you're part of <span className={`${theme.accentColor} font-bold`}>The Internet Health Site</span>, great news — 
              you already have <span className={`${theme.accentColor} font-bold`}>free access</span> to the 
              <span className={`${theme.accentColor} font-bold`}> Internet Health Club</span>. We'll walk you through 
              every step of getting in shape, right from your phone or computer.
            </p>

            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              No gym needed. No confusing plans. Just a <span className={`${theme.accentColor} font-bold`}>real coach</span>, 
              a <span className={`${theme.accentColor} font-bold`}>real plan</span>, and 
              <span className={`${theme.accentColor} font-bold`}> real people</span> cheering you on every day.
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
                "I kept saying I'd start Monday. Then I found this group and everything changed. 
                My coach made it so simple. I lost 34 pounds and I did it all from my living room!"
              </p>
              <p className="text-sm text-gray-600 mt-2">- Sarah M., lost 34 lbs in 90 days from home</p>
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
                <span className="text-base font-bold text-gray-800">What You Get (Free with Your Membership):</span>
                <div className="mt-3 space-y-2 text-sm font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <span>💪</span>
                    <span>Easy workouts you can do at home</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎯</span>
                    <span>Your own coach who checks in on you</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔥</span>
                    <span>Simple meal ideas that don't feel like a diet</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🤝</span>
                    <span>A friendly group that keeps you going</span>
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
                Pick a goal and we'll show you exactly how to get there — from home! 💥
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ComicGoal
              icon={Target}
              title="Lose Weight"
              description="We build a simple plan around YOUR life. Eat food you like. Move at your pace. Watch the pounds drop."
              color="bg-red-500"
              bgColor="bg-red-200"
              index={0}
            />
            <ComicGoal
              icon={Heart}
              title="Heal & Recover"
              description="Coming back from an injury? We'll guide you through every step so you feel strong again."
              color="bg-blue-500"
              bgColor="bg-blue-200"
              index={1}
            />
            <ComicGoal
              icon={Dumbbell}
              title="Get Stronger"
              description="Build muscle at home with simple exercises. No fancy equipment needed — just you and a plan."
              color="bg-green-500"
              bgColor="bg-green-200"
              index={2}
            />
            <ComicGoal
              icon={Activity}
              title="Move Better"
              description="Feel stiff or achy? We'll help you move freely again so everyday stuff feels easy."
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
              Our Members Are Getting Real Results
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These aren't just numbers — they're people like you who decided to start. Here's how they're doing.
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
              <h4 className="text-xl font-semibold mb-3">Weight Loss</h4>
              <p className="text-gray-600 mb-4">
                Your coach builds a plan you can actually stick to. No crazy diets — just simple changes that work.
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
              <h4 className="text-xl font-semibold mb-3">Recovery</h4>
              <p className="text-gray-600 mb-4">
                Hurt your back? Bad knee? Your coach walks you through getting better, one day at a time.
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
              <h4 className="text-xl font-semibold mb-3">Flexibility</h4>
              <p className="text-gray-600 mb-4">
                Stretch, move, and feel good again. Members say they feel 20 years younger in just weeks.
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
              <h4 className="text-xl font-semibold mb-3">Community</h4>
              <p className="text-gray-600 mb-4">
                You're never alone. Post a win, ask a question, or just vent — someone's always there.
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
              People Just Like You Are Doing It
            </h3>
            <p className="text-xl text-gray-600">
              These are regular people — moms, dads, grandparents, busy workers — who finally found something that works
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
                "I never thought I could lose weight without going to a gym. My coach made it so easy — told me exactly what to eat and what exercises to do at home. 45 pounds gone and I feel amazing!"
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
                "After knee surgery I thought I was done. My coach gave me simple exercises to do at home and checked on me every day. Now I'm hiking again! I honestly can't believe it."
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
                "I'm 62 and in the best shape of my life. I do everything from home. I can keep up with my grandkids now and my back doesn't hurt anymore. Wish I'd found this years ago."
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
              Everything You Need — All Included Free
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your Health Club membership comes with everything. A coach, a plan, a community, and simple tools to track your progress.
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
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">Your Own Personal Coach</h4>
                    <p className="text-gray-600">A real person who builds your plan, checks in on you, and answers your questions. It's like having a friend who's also a trainer.</p>
                    <div className="mt-2 text-sm text-red-600 font-medium">✨ Your coach is a real person, not a bot</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Simple Plans on Your Phone</h4>
                    <p className="text-gray-600">Easy videos to follow along with, simple meal ideas, and daily check-ins — all right on your phone.</p>
                    <div className="mt-2 text-sm text-blue-600 font-medium">📱 Works on any phone or computer</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-green-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">A Group That Actually Cares</h4>
                    <p className="text-gray-600">Post your wins, ask questions, or just say hi. Everyone here is on the same journey and they've got your back.</p>
                    <div className="mt-2 text-sm text-green-600 font-medium">💬 Someone's always around to help</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-purple-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">See How Far You've Come</h4>
                    <p className="text-gray-600">Track your wins, earn badges, and watch your progress add up. It feels good to see it all laid out.</p>
                    <div className="mt-2 text-sm text-purple-600 font-medium">🏆 Every small win counts</div>
                  </div>
                </div>
                
                <div className="flex items-start group cursor-pointer p-4 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                  <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-600 transition-colors">Live Group Sessions Every Week</h4>
                    <p className="text-gray-600">Hop on a live call, ask anything, and work out with the group. It's fun and it keeps you showing up.</p>
                    <div className="mt-2 text-sm text-yellow-600 font-medium">📅 New sessions every week</div>
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
                  <h4 className="text-2xl font-bold mb-2">Free Health Club Membership!</h4>
                  <p className="text-yellow-100 font-bold">Spots are limited — Offer ends in {formatTime(timeLeft)}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Your own personal coach</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Easy-to-follow plans from home</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>30-Day Transformation Guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Friendly community that has your back</span>
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
              Why People Love the Health Club
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              It's not a fancy app or a complicated program. It's simple: a coach, a plan, and people who care. That's why it works.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Users className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-red-400 transition-colors">A Real Coach in Your Corner</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Your coach is a message away. They tell you what to eat, what to do, and keep you on track. It's like having a trainer without the gym price tag.
              </p>
              <div className="mt-4 text-red-400 font-semibold">
                💪 Real person, real help
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Target className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">It Actually Works</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                No gimmicks. No magic pills. Just a simple plan that fits your life. Thousands of people have done it and you can too.
              </p>
              <div className="mt-4 text-blue-400 font-semibold">
                📈 4.9 out of 5 stars from members
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Shield className="h-10 w-10 group-hover:animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-4 group-hover:text-green-400 transition-colors">Try It Risk-Free</h4>
              <p className="text-gray-300 group-hover:text-white transition-colors">
                Not sure? No problem. Try it for 30 days. If you don't like it or don't see results, you get your money back. Simple as that.
              </p>
              <div className="mt-4 text-green-400 font-semibold">
                🛡️ 30-day money back, no questions
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
              Your Free Health Club Membership Is Ready
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              As an Internet Health Site member, you get free access to the Health Club. 
              A coach, a plan, and a community — all waiting for you. Don't put it off.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">Ready to Feel Good Again?</div>
              <div className="text-sm opacity-80">Join the Health Club — it's free with your membership</div>
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
              "I kept putting it off. Then one day I just signed up and it was the best decision I ever made." 
              — You'll wish you started sooner. Everyone does.
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

      <SocialProofToast />

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