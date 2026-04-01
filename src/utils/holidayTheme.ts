export interface HolidayTheme {
  name: string;
  emoji: string;
  secondaryEmoji: string;
  gradient: string;        // primary gradient (header, CTA banner)
  gradientHover: string;   // hover state
  accentColor: string;     // text accent
  badgeGradient: string;   // badge/pill gradient
  bgLight: string;         // hero section bg
  borderAccent: string;    // border color
  urgencyText: string;     // countdown banner text
  giftText: string;        // CTA button text
  headerBadge: string;     // header pill text
  heroHeadline: string;    // main headline
  heroSubline: string;     // sub-headline
  ctaPrimary: string;      // main CTA
  ctaSecondary: string;    // secondary CTA
  surveyHeading: string;   // popup heading
  footerBadge: string;     // footer badge text
}

function getEasterDate(year: number): Date {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getHolidayTheme(): HolidayTheme {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  const year = now.getFullYear();

  // Helper: check date range
  const inRange = (startMonth: number, startDay: number, endMonth: number, endDay: number) => {
    const start = new Date(year, startMonth, startDay);
    const end = new Date(year, endMonth, endDay);
    return now >= start && now <= end;
  };

  // === NEW YEAR (Dec 26 - Jan 15) ===
  if (inRange(0, 1, 0, 15) || inRange(11, 26, 11, 31)) {
    return {
      name: "New Year",
      emoji: "🎆",
      secondaryEmoji: "✨",
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      gradientHover: "hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700",
      accentColor: "text-indigo-600",
      badgeGradient: "from-indigo-100 via-purple-100 to-pink-100",
      bgLight: "from-indigo-50 via-purple-50 to-pink-50",
      borderAccent: "border-indigo-300",
      urgencyText: "NEW YEAR NEW YOU — ENROLLMENT CLOSES IN:",
      giftText: "Claim Your New Year Transformation",
      headerBadge: "NEW YEAR SALE",
      heroHeadline: "Make This the Year You Finally Transform Your Body",
      heroSubline: "New Year, New You — Limited Launch Pricing!",
      ctaPrimary: "🎆 Start My New Year Transformation",
      ctaSecondary: "🔥 New Year, New Body — JOIN NOW",
      surveyHeading: "Your New Year Transformation Starts Here!",
      footerBadge: "HAPPY NEW YEAR",
    };
  }

  // === VALENTINE'S DAY (Jan 16 - Feb 18) ===
  if (inRange(0, 16, 1, 18)) {
    return {
      name: "Valentine's Day",
      emoji: "💕",
      secondaryEmoji: "❤️",
      gradient: "from-rose-500 via-pink-500 to-red-500",
      gradientHover: "hover:from-rose-600 hover:via-pink-600 hover:to-red-600",
      accentColor: "text-pink-600",
      badgeGradient: "from-rose-100 via-pink-100 to-red-100",
      bgLight: "from-rose-50 via-pink-50 to-red-50",
      borderAccent: "border-pink-300",
      urgencyText: "LOVE YOUR BODY SALE ENDS IN:",
      giftText: "Give Yourself the Gift of Health",
      headerBadge: "VALENTINE'S SPECIAL",
      heroHeadline: "Fall in Love with Your Body Again This Valentine's Season",
      heroSubline: "The Ultimate Act of Self-Love — Your Health Transformation!",
      ctaPrimary: "💕 Start My Self-Love Journey",
      ctaSecondary: "❤️ Love Your Body — JOIN NOW",
      surveyHeading: "Your Self-Love Journey Starts Here!",
      footerBadge: "HAPPY VALENTINE'S",
    };
  }

  // === EASTER / SPRING (Feb 19 - Apr 20, check for Easter proximity) ===
  if (inRange(1, 19, 3, 20)) {
    const easter = getEasterDate(year);
    const diffDays = Math.abs((now.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 14) {
      return {
        name: "Easter",
        emoji: "🐣",
        secondaryEmoji: "🌸",
        gradient: "from-yellow-400 via-pink-400 to-purple-400",
        gradientHover: "hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500",
        accentColor: "text-purple-600",
        badgeGradient: "from-yellow-100 via-pink-100 to-purple-100",
        bgLight: "from-yellow-50 via-pink-50 to-purple-50",
        borderAccent: "border-purple-300",
        urgencyText: "EASTER RENEWAL SALE ENDS IN:",
        giftText: "Unwrap Your Easter Transformation",
        headerBadge: "EASTER SPECIAL",
        heroHeadline: "Spring Into a Brand New You This Easter",
        heroSubline: "Renew Your Body, Renew Your Spirit!",
        ctaPrimary: "🐣 Start My Easter Renewal",
        ctaSecondary: "🌸 Spring Into Health — JOIN NOW",
        surveyHeading: "Your Easter Renewal Starts Here!",
        footerBadge: "HAPPY EASTER",
      };
    }
    // Otherwise just Spring
    return {
      name: "Spring",
      emoji: "🌷",
      secondaryEmoji: "🌿",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      gradientHover: "hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600",
      accentColor: "text-emerald-600",
      badgeGradient: "from-emerald-100 via-teal-100 to-cyan-100",
      bgLight: "from-emerald-50 via-teal-50 to-cyan-50",
      borderAccent: "border-emerald-300",
      urgencyText: "SPRING INTO FITNESS — ENROLLMENT CLOSES IN:",
      giftText: "Bloom Into Your Best Body",
      headerBadge: "SPRING SALE",
      heroHeadline: "Spring Into the Best Shape of Your Life",
      heroSubline: "New Season, New Body — Limited Spring Pricing!",
      ctaPrimary: "🌷 Start My Spring Transformation",
      ctaSecondary: "🌿 Spring Forward — JOIN NOW",
      surveyHeading: "Your Spring Transformation Starts Here!",
      footerBadge: "SPRING REFRESH",
    };
  }

  // === MEMORIAL DAY / SUMMER PREP (Apr 21 - Jun 20) ===
  if (inRange(3, 21, 5, 20)) {
    return {
      name: "Summer Body",
      emoji: "☀️",
      secondaryEmoji: "🏖️",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      gradientHover: "hover:from-amber-600 hover:via-orange-600 hover:to-red-600",
      accentColor: "text-orange-600",
      badgeGradient: "from-amber-100 via-orange-100 to-red-100",
      bgLight: "from-amber-50 via-orange-50 to-yellow-50",
      borderAccent: "border-orange-300",
      urgencyText: "SUMMER BODY COUNTDOWN — ENROLLMENT CLOSES IN:",
      giftText: "Get Your Dream Summer Body",
      headerBadge: "SUMMER BODY SALE",
      heroHeadline: "Get Your Summer Body Before Beach Season Hits",
      heroSubline: "The Clock Is Ticking — Summer Waits for Nobody!",
      ctaPrimary: "☀️ Start My Summer Body Plan",
      ctaSecondary: "🏖️ Beach Ready — JOIN NOW",
      surveyHeading: "Your Summer Body Starts Here!",
      footerBadge: "SUMMER READY",
    };
  }

  // === INDEPENDENCE DAY / JULY 4 (Jun 21 - Jul 10) ===
  if (inRange(5, 21, 6, 10)) {
    return {
      name: "Independence Day",
      emoji: "🇺🇸",
      secondaryEmoji: "🎆",
      gradient: "from-blue-600 via-red-500 to-blue-600",
      gradientHover: "hover:from-blue-700 hover:via-red-600 hover:to-blue-700",
      accentColor: "text-blue-600",
      badgeGradient: "from-blue-100 via-red-100 to-blue-100",
      bgLight: "from-blue-50 via-red-50 to-blue-50",
      borderAccent: "border-blue-300",
      urgencyText: "FREEDOM FROM FAT SALE ENDS IN:",
      giftText: "Declare Your Body Independence",
      headerBadge: "JULY 4TH SALE",
      heroHeadline: "Declare Independence from the Body You Don't Want",
      heroSubline: "This July 4th — Celebrate Your Freedom to Transform!",
      ctaPrimary: "🇺🇸 Declare My Body Freedom",
      ctaSecondary: "🎆 Freedom Sale — JOIN NOW",
      surveyHeading: "Your Freedom Journey Starts Here!",
      footerBadge: "HAPPY 4TH",
    };
  }

  // === BACK TO SCHOOL / LATE SUMMER (Jul 11 - Sep 15) ===
  if (inRange(6, 11, 8, 15)) {
    return {
      name: "Back to Basics",
      emoji: "💪",
      secondaryEmoji: "🔥",
      gradient: "from-slate-700 via-blue-600 to-slate-700",
      gradientHover: "hover:from-slate-800 hover:via-blue-700 hover:to-slate-800",
      accentColor: "text-blue-600",
      badgeGradient: "from-slate-100 via-blue-100 to-slate-100",
      bgLight: "from-slate-50 via-blue-50 to-slate-50",
      borderAccent: "border-blue-300",
      urgencyText: "BACK TO BASICS — ENROLLMENT CLOSES IN:",
      giftText: "Reset Your Health This Season",
      headerBadge: "LATE SUMMER SALE",
      heroHeadline: "Summer Isn't Over — There's Still Time to Transform",
      heroSubline: "Get Back to Basics and Build the Body You Deserve!",
      ctaPrimary: "💪 Start My Body Reset",
      ctaSecondary: "🔥 Back to Basics — JOIN NOW",
      surveyHeading: "Your Body Reset Starts Here!",
      footerBadge: "GET STRONG",
    };
  }

  // === HALLOWEEN / FALL (Sep 16 - Nov 5) ===
  if (inRange(8, 16, 10, 5)) {
    if (inRange(9, 20, 10, 1)) {
      // Halloween week
      return {
        name: "Halloween",
        emoji: "🎃",
        secondaryEmoji: "👻",
        gradient: "from-orange-600 via-black to-orange-600",
        gradientHover: "hover:from-orange-700 hover:via-gray-900 hover:to-orange-700",
        accentColor: "text-orange-600",
        badgeGradient: "from-orange-100 via-yellow-100 to-orange-100",
        bgLight: "from-orange-50 via-yellow-50 to-orange-50",
        borderAccent: "border-orange-400",
        urgencyText: "SCARY GOOD DEAL — ENDS IN:",
        giftText: "Scare Away the Old You",
        headerBadge: "HALLOWEEN SPECIAL",
        heroHeadline: "Don't Be Scared of Change — Transform Your Body Now",
        heroSubline: "The Only Thing Scary Is Not Starting!",
        ctaPrimary: "🎃 Scare Away My Excuses",
        ctaSecondary: "👻 Halloween Deal — JOIN NOW",
        surveyHeading: "Your Scary-Good Transformation Starts Here!",
        footerBadge: "HAPPY HALLOWEEN",
      };
    }
    // General Fall
    return {
      name: "Fall Fitness",
      emoji: "🍂",
      secondaryEmoji: "🍁",
      gradient: "from-amber-600 via-orange-600 to-red-600",
      gradientHover: "hover:from-amber-700 hover:via-orange-700 hover:to-red-700",
      accentColor: "text-amber-600",
      badgeGradient: "from-amber-100 via-orange-100 to-red-100",
      bgLight: "from-amber-50 via-orange-50 to-red-50",
      borderAccent: "border-amber-300",
      urgencyText: "FALL INTO FITNESS — ENROLLMENT CLOSES IN:",
      giftText: "Fall Into Your Best Body",
      headerBadge: "FALL SALE",
      heroHeadline: "Don't Fall Behind — Get Ahead of Your Fitness Goals",
      heroSubline: "This Autumn, Build the Foundation for Your Best Year!",
      ctaPrimary: "🍂 Start My Fall Transformation",
      ctaSecondary: "🍁 Fall Into Fitness — JOIN NOW",
      surveyHeading: "Your Fall Transformation Starts Here!",
      footerBadge: "FALL REFRESH",
    };
  }

  // === THANKSGIVING (Nov 6 - Nov 30) ===
  if (inRange(10, 6, 10, 30)) {
    return {
      name: "Thanksgiving",
      emoji: "🦃",
      secondaryEmoji: "🙏",
      gradient: "from-amber-700 via-orange-600 to-yellow-600",
      gradientHover: "hover:from-amber-800 hover:via-orange-700 hover:to-yellow-700",
      accentColor: "text-amber-700",
      badgeGradient: "from-amber-100 via-orange-100 to-yellow-100",
      bgLight: "from-amber-50 via-orange-50 to-yellow-50",
      borderAccent: "border-amber-400",
      urgencyText: "THANKFUL FOR HEALTH — SALE ENDS IN:",
      giftText: "Be Thankful for a Healthy Body",
      headerBadge: "THANKSGIVING DEAL",
      heroHeadline: "This Thanksgiving, Be Grateful for the Body You're Building",
      heroSubline: "Give Thanks by Giving Yourself the Gift of Health!",
      ctaPrimary: "🦃 Start My Grateful Transformation",
      ctaSecondary: "🙏 Thankful Deal — JOIN NOW",
      surveyHeading: "Your Grateful Transformation Starts Here!",
      footerBadge: "HAPPY THANKSGIVING",
    };
  }

  // === CHRISTMAS / HOLIDAY (Dec 1 - Dec 25) ===
  if (inRange(11, 1, 11, 25)) {
    return {
      name: "Holiday Season",
      emoji: "🎄",
      secondaryEmoji: "🎁",
      gradient: "from-red-600 via-green-600 to-red-600",
      gradientHover: "hover:from-red-700 hover:via-green-700 hover:to-red-700",
      accentColor: "text-red-600",
      badgeGradient: "from-red-100 via-green-100 to-red-100",
      bgLight: "from-red-50 via-green-50 to-yellow-50",
      borderAccent: "border-red-300",
      urgencyText: "HOLIDAY SPECIAL ENDS IN:",
      giftText: "Give Yourself the Ultimate Holiday Gift",
      headerBadge: "HOLIDAY SALE",
      heroHeadline: "Give Yourself the Gift of Health This Holiday Season",
      heroSubline: "Limited Holiday Special — Transform Before the New Year!",
      ctaPrimary: "🎁 Unwrap My Transformation",
      ctaSecondary: "🎄 Holiday Special — JOIN NOW",
      surveyHeading: "Your Holiday Gift Awaits!",
      footerBadge: "HAPPY HOLIDAYS",
    };
  }

  // === DEFAULT / Generic (should not hit but just in case) ===
  return {
    name: "Limited Time",
    emoji: "⚡",
    secondaryEmoji: "🔥",
    gradient: "from-red-600 via-orange-600 to-red-600",
    gradientHover: "hover:from-red-700 hover:via-orange-700 hover:to-red-700",
    accentColor: "text-red-600",
    badgeGradient: "from-red-100 via-orange-100 to-red-100",
    bgLight: "from-red-50 via-orange-50 to-yellow-50",
    borderAccent: "border-red-300",
    urgencyText: "FLASH SALE ENDS IN:",
    giftText: "Claim Your Spot Now",
    headerBadge: "FLASH SALE",
    heroHeadline: "Transform Your Body — Your Journey Starts Today",
    heroSubline: "Limited Time Offer — Don't Miss Out!",
    ctaPrimary: "⚡ Start My Transformation Now",
    ctaSecondary: "🔥 Limited Time — JOIN NOW",
    surveyHeading: "Your Transformation Starts Here!",
    footerBadge: "LIMITED TIME",
  };
}
