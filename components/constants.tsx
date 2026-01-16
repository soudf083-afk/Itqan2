import React from 'react';
import { Award, Zap, Moon, Sun, Star } from 'lucide-react';
import { City, Achievement } from '../types';

export const CITIES: Omit<City, 'isUnlocked'>[] = [
  { id: 1, name: 'بوابة النية', description: 'بداية رحلتك الإيمانية مع جزء عم', juzRange: [30, 30] },
  { id: 2, name: 'مدينة النور', description: 'رحلة عبر الأجزاء الأخيرة', juzRange: [28, 29] },
  { id: 3, name: 'واحة السكينة', description: 'تثبيت الحفظ في سور مسبحات', juzRange: [25, 27] },
  { id: 4, name: 'قصر الفرقان', description: 'الغوص في المعاني العميقة', juzRange: [20, 24] },
  { id: 5, name: 'جنة الحفاظ', description: 'الوصول إلى السور الطوال', juzRange: [1, 19] },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'وسام الفجر', description: 'حفظ آيات في وقت السحر', icon: 'Sun', unlocked: true },
  { id: '2', title: 'وسام الثبات', description: 'استمرار لمدة 7 أيام متتالية', icon: 'Zap', unlocked: false },
  { id: '3', title: 'وسام المراجعة', description: 'إتمام مراجعة جزء كامل', icon: 'Award', unlocked: false },
];

export const SURAHS: any[] = [
  { number: 1, name: "الفاتحة", numberOfAyahs: 7, type: "مكية", page: 1 },
  { number: 2, name: "البقرة", numberOfAyahs: 286, type: "مدنية", page: 2 },
  { number: 3, name: "آل عمران", numberOfAyahs: 200, type: "مدنية", page: 50 },
  { number: 4, name: "النساء", numberOfAyahs: 176, type: "مدنية", page: 77 },
  { number: 5, name: "المائدة", numberOfAyahs: 120, type: "مدنية", page: 106 },
  { number: 6, name: "الأنعام", numberOfAyahs: 165, type: "مكية", page: 128 },
  { number: 7, name: "الأعراف", numberOfAyahs: 206, type: "مكية", page: 151 },
  { number: 8, name: "الأنفال", numberOfAyahs: 75, type: "مدنية", page: 177 },
  { number: 9, name: "التوبة", numberOfAyahs: 129, type: "مدنية", page: 187 },
  { number: 10, name: "يونس", numberOfAyahs: 109, type: "مكية", page: 208 },
  { number: 11, name: "هود", numberOfAyahs: 123, type: "مكية", page: 221 },
  { number: 12, name: "يوسف", numberOfAyahs: 111, type: "مكية", page: 235 },
  { number: 13, name: "الرعد", numberOfAyahs: 43, type: "مدنية", page: 249 },
  { number: 14, name: "إبراهيم", numberOfAyahs: 52, type: "مكية", page: 255 },
  { number: 15, name: "الحجر", numberOfAyahs: 99, type: "مكية", page: 262 },
  { number: 16, name: "النحل", numberOfAyahs: 128, type: "مكية", page: 267 },
  { number: 17, name: "الإسراء", numberOfAyahs: 111, type: "مكية", page: 282 },
  { number: 18, name: "الكهف", numberOfAyahs: 110, type: "مكية", page: 293 },
  { number: 19, name: "مريم", numberOfAyahs: 98, type: "مكية", page: 305 },
  { number: 20, name: "طه", numberOfAyahs: 135, type: "مكية", page: 312 },
  { number: 21, name: "الأنبياء", numberOfAyahs: 112, type: "مكية", page: 322 },
  { number: 22, name: "الحج", numberOfAyahs: 78, type: "مدنية", page: 332 },
  { number: 23, name: "المؤمنون", numberOfAyahs: 118, type: "مكية", page: 342 },
  { number: 24, name: "النور", numberOfAyahs: 64, type: "مدنية", page: 350 },
  { number: 25, name: "الفرقان", numberOfAyahs: 77, type: "مكية", page: 359 },
  { number: 26, name: "الشعراء", numberOfAyahs: 227, type: "مكية", page: 367 },
  { number: 27, name: "النمل", numberOfAyahs: 93, type: "مكية", page: 377 },
  { number: 28, name: "القصص", numberOfAyahs: 88, type: "مكية", page: 385 },
  { number: 29, name: "العنكبوت", numberOfAyahs: 69, type: "مكية", page: 396 },
  { number: 30, name: "الروم", numberOfAyahs: 60, type: "مكية", page: 404 },
  { number: 31, name: "لقمان", numberOfAyahs: 34, type: "مكية", page: 411 },
  { number: 32, name: "السجدة", numberOfAyahs: 30, type: "مكية", page: 415 },
  { number: 33, name: "الأحزاب", numberOfAyahs: 73, type: "مدنية", page: 418 },
  { number: 34, name: "سبأ", numberOfAyahs: 54, type: "مكية", page: 428 },
  { number: 35, name: "فاطر", numberOfAyahs: 45, type: "مكية", page: 434 },
  { number: 36, name: "يس", numberOfAyahs: 83, type: "مكية", page: 440 },
  { number: 37, name: "الصافات", numberOfAyahs: 182, type: "مكية", page: 446 },
  { number: 38, name: "ص", numberOfAyahs: 88, type: "مكية", page: 453 },
  { number: 39, name: "الزمر", numberOfAyahs: 75, type: "مكية", page: 458 },
  { number: 40, name: "غافر", numberOfAyahs: 85, type: "مكية", page: 467 },
  { number: 41, name: "فصلت", numberOfAyahs: 54, type: "مكية", page: 477 },
  { number: 42, name: "الشورى", numberOfAyahs: 53, type: "مكية", page: 483 },
  { number: 43, name: "الزخرف", numberOfAyahs: 89, type: "مكية", page: 489 },
  { number: 44, name: "الدخان", numberOfAyahs: 59, type: "مكية", page: 496 },
  { number: 45, name: "الجاثية", numberOfAyahs: 37, type: "مكية", page: 499 },
  { number: 46, name: "الأحقاف", numberOfAyahs: 35, type: "مكية", page: 502 },
  { number: 47, name: "محمد", numberOfAyahs: 38, type: "مدنية", page: 507 },
  { number: 48, name: "الفتح", numberOfAyahs: 29, type: "مدنية", page: 511 },
  { number: 49, name: "الحجرات", numberOfAyahs: 18, type: "مدنية", page: 515 },
  { number: 50, name: "ق", numberOfAyahs: 45, type: "مكية", page: 518 },
  { number: 51, name: "الذاريات", numberOfAyahs: 60, type: "مكية", page: 520 },
  { number: 52, name: "الطور", numberOfAyahs: 49, type: "مكية", page: 523 },
  { number: 53, name: "النجم", numberOfAyahs: 62, type: "مكية", page: 526 },
  { number: 54, name: "القمر", numberOfAyahs: 55, type: "مكية", page: 528 },
  { number: 55, name: "الرحمن", numberOfAyahs: 78, type: "مدنية", page: 531 },
  { number: 56, name: "الواقعة", numberOfAyahs: 96, type: "مكية", page: 534 },
  { number: 57, name: "الحديد", numberOfAyahs: 29, type: "مدنية", page: 537 },
  { number: 58, name: "المجادلة", numberOfAyahs: 22, type: "مدنية", page: 542 },
  { number: 59, name: "الحشر", numberOfAyahs: 24, type: "مدنية", page: 545 },
  { number: 60, name: "الممتحنة", numberOfAyahs: 13, type: "مدنية", page: 549 },
  { number: 61, name: "الصف", numberOfAyahs: 14, type: "مدنية", page: 551 },
  { number: 62, name: "الجمعة", numberOfAyahs: 11, type: "مدنية", page: 553 },
  { number: 63, name: "المنافقون", numberOfAyahs: 11, type: "مدنية", page: 554 },
  { number: 64, name: "التغابن", numberOfAyahs: 18, type: "مدنية", page: 556 },
  { number: 65, name: "الطلاق", numberOfAyahs: 12, type: "مدنية", page: 558 },
  { number: 66, name: "التحريم", numberOfAyahs: 12, type: "مدنية", page: 560 },
  { number: 67, name: "الملك", numberOfAyahs: 30, type: "مكية", page: 562 },
  { number: 68, name: "القلم", numberOfAyahs: 52, type: "مكية", page: 564 },
  { number: 69, name: "الحاقة", numberOfAyahs: 52, type: "مكية", page: 566 },
  { number: 70, name: "المعارج", numberOfAyahs: 44, type: "مكية", page: 568 },
  { number: 71, name: "نوح", numberOfAyahs: 28, type: "مكية", page: 570 },
  { number: 72, name: "الجن", numberOfAyahs: 28, type: "مكية", page: 572 },
  { number: 73, name: "المزمل", numberOfAyahs: 20, type: "مكية", page: 574 },
  { number: 74, name: "المدثر", numberOfAyahs: 56, type: "مكية", page: 575 },
  { number: 75, name: "القيامة", numberOfAyahs: 40, type: "مكية", page: 577 },
  { number: 76, name: "الإنسان", numberOfAyahs: 31, type: "مدنية", page: 578 },
  { number: 77, name: "المرسلات", numberOfAyahs: 50, type: "مكية", page: 580 },
  { number: 78, name: "النبأ", numberOfAyahs: 40, type: "مكية", page: 582 },
  { number: 79, name: "النازعات", numberOfAyahs: 46, type: "مكية", page: 583 },
  { number: 80, name: "عبس", numberOfAyahs: 42, type: "مكية", page: 585 },
  { number: 81, name: "التكوير", numberOfAyahs: 29, type: "مكية", page: 586 },
  { number: 82, name: "الانفطار", numberOfAyahs: 19, type: "مكية", page: 587 },
  { number: 83, name: "المطففين", numberOfAyahs: 36, type: "مكية", page: 587 },
  { number: 84, name: "الانشقاق", numberOfAyahs: 25, type: "مكية", page: 589 },
  { number: 85, name: "البروج", numberOfAyahs: 22, type: "مكية", page: 590 },
  { number: 86, name: "الطارق", numberOfAyahs: 17, type: "مكية", page: 591 },
  { number: 87, name: "الأعلى", numberOfAyahs: 19, type: "مكية", page: 591 },
  { number: 88, name: "الغاشية", numberOfAyahs: 26, type: "مكية", page: 592 },
  { number: 89, name: "الفجر", numberOfAyahs: 30, type: "مكية", page: 593 },
  { number: 90, name: "البلد", numberOfAyahs: 20, type: "مكية", page: 594 },
  { number: 91, name: "الشمس", numberOfAyahs: 15, type: "مكية", page: 595 },
  { number: 92, name: "الليل", numberOfAyahs: 21, type: "مكية", page: 595 },
  { number: 93, name: "الضحى", numberOfAyahs: 11, type: "مكية", page: 596 },
  { number: 94, name: "الشرح", numberOfAyahs: 8, type: "مكية", page: 596 },
  { number: 95, name: "التين", numberOfAyahs: 8, type: "مكية", page: 597 },
  { number: 96, name: "العلق", numberOfAyahs: 19, type: "مكية", page: 597 },
  { number: 97, name: "القدر", numberOfAyahs: 5, type: "مكية", page: 598 },
  { number: 98, name: "البينة", numberOfAyahs: 8, type: "مدنية", page: 598 },
  { number: 99, name: "الزلزلة", numberOfAyahs: 8, type: "مدنية", page: 599 },
  { number: 100, name: "العاديات", numberOfAyahs: 11, type: "مكية", page: 599 },
  { number: 101, name: "القارعة", numberOfAyahs: 11, type: "مكية", page: 600 },
  { number: 102, name: "التكاثر", numberOfAyahs: 8, type: "مكية", page: 600 },
  { number: 103, name: "العصر", numberOfAyahs: 3, type: "مكية", page: 601 },
  { number: 104, name: "الهمزة", numberOfAyahs: 9, type: "مكية", page: 601 },
  { number: 105, name: "الفيل", numberOfAyahs: 5, type: "مكية", page: 602 },
  { number: 106, name: "قريش", numberOfAyahs: 4, type: "مكية", page: 602 },
  { number: 107, name: "الماعون", numberOfAyahs: 7, type: "مكية", page: 603 },
  { number: 108, name: "الكوثر", numberOfAyahs: 3, type: "مكية", page: 603 },
  { number: 109, name: "الكافرون", numberOfAyahs: 6, type: "مكية", page: 604 },
  { number: 110, name: "النصر", numberOfAyahs: 3, type: "مدنية", page: 604 },
  { number: 111, name: "المسد", numberOfAyahs: 5, type: "مكية", page: 605 },
  { number: 112, name: "الإخلاص", numberOfAyahs: 4, type: "مكية", page: 605 },
  { number: 113, name: "الفلق", numberOfAyahs: 5, type: "مكية", page: 606 },
  { number: 114, name: "الناس", numberOfAyahs: 6, type: "مكية", page: 606 },
];

export const RECITERS = [
  { id: 1, name: "مشاري راشد العفاسي", identifier: "ar.alafasy", style: "عذب هادئ", mp3quranId: "Alafasy_128kbps" },
  { id: 2, name: "عبد الباسط عبد الصمد", identifier: "ar.abdulbasitmurattal", style: "تجويد كلاسيكي", mp3quranId: "basit" },
  { id: 3, name: "محمود خليل الحصري", identifier: "ar.husary", style: "معلم متقن", mp3quranId: "husr" },
  { id: 4, name: "ماهر المعيقلي", identifier: "ar.mahermuaiqly", style: "خشوع الحرم", mp3quranId: "maher" },
  { id: 5, name: "سعود الشريم", identifier: "ar.saoodshuraym", style: "تلاوة سريعة", mp3quranId: "shur" },
  { id: 6, name: "ياسر الدوسري", identifier: "ar.yasseradosari", style: "نبرة حجازية", mp3quranId: "yasser" },
  { id: 7, name: "ناصر القطامي", identifier: "ar.naseralqatami", style: "خاشع", mp3quranId: "qtm" },
  { id: 8, name: "سعد الغامدي", identifier: "ar.saadalgamdi", style: "مرتل", mp3quranId: "s_gmd" },
  { id: 9, name: "محمد صديق المنشاوي", identifier: "ar.minshawi", style: "ترتيل هادئ", mp3quranId: "minsh" },
  { id: 10, name: "أحمد العجمي", identifier: "ar.ahmedajamy", style: "مؤثر", mp3quranId: "ajm" },
  { id: 11, name: "عبد الرحمن السديس", identifier: "ar.asudais", style: "تلاوة الحرم", mp3quranId: "sds" },
  { id: 12, name: "خالد الجليل", identifier: "ar.khaledaljaleel", style: "تلاوة خاشعة", mp3quranId: "jleel" },
];

export const AZKAR = [
  {
    category: "أذكار الصباح",
    items: [
      { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوة عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
      { text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِليَّ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدك وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ", count: 1 },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
    ]
  },
  {
    category: "أذكار المساء",
    items: [
      { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
      { text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
      { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 }
    ]
  },
  {
    category: "أذكار الاستيقاظ",
    items: [
      { text: "الحَمْدُ للهِ الذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", count: 1 },
      { text: "لا إِلَهَ إِلا اللهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، الحَمْدُ للهِ، وَسُبْحانَ اللهِ، وَلا إِلَهَ إِلا اللهُ، وَاللهُ أَكْبَرُ، وَلا حَوْلَ وَلا قُوَّةَ إِلا بِاللهِ", count: 1 }
    ]
  },
  {
    category: "أذكار المسجد",
    items: [
      { text: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", count: 1, type: "دخول المسجد" },
      { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", count: 1, type: "الخروج من المسجد" }
    ]
  },
  {
    category: "أذكار بعد الصلاة",
    items: [
      { text: "أستغفر الله، أستغفر الله، أستغفر الله، اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام", count: 1 },
      { text: "سُبْحَانَ اللَّهِ", count: 33 },
      { text: "الْحَمْدُ لِلَّهِ", count: 33 },
      { text: "اللَّهُ أَكْبَرُ", count: 33 }
    ]
  }
];