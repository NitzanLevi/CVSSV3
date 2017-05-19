var app = angular.module('CVSSApp', ['ui.bootstrap', 'sticky', 'chart.js', 'pascalprecht.translate', '720kb.tooltips']).config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.controller('CVSSController', ['$scope', '$location', function ($scope, $location) {
    this.baseMetricScore = "NA";
    this.environmentalMetricScore = "NA";
    this.temporalMetricScore = "NA";
    this.vectorString = "";
    this.baseURL = "https://nitzanlevi.github.io/CVSSV3/";
    //this.baseURL =  "http://127.0.0.1:52079/index.html";
    this.cvssValid = false;


    this.CVSSData = {
        CVSS: "",
        AV: "",
        AC: "",
        PR: "",
        UI: "",
        S: "",
        C: "",
        I: "",
        A: "",
        E: "X",
        RL: "X",
        RC: "X",
        MAV: "X",
        MAC: "X",
        MPR: "X",
        MUI: "X",
        MS: "X",
        MC: "X",
        MI: "X",
        MA: "X",
        CR: "X",
        IR: "X",
        AR: "X"
    };

    this.setScore = function () {
        var cvssResult = CVSS.calculateCVSSFromMetrics(
            this.CVSSData.AV, this.CVSSData.AC, this.CVSSData.PR, this.CVSSData.UI, this.CVSSData.S, this.CVSSData.C, this.CVSSData.I, this.CVSSData.A,
            this.CVSSData.E, this.CVSSData.RL, this.CVSSData.RC,
            this.CVSSData.CR, this.CVSSData.IR, this.CVSSData.AR,
            this.CVSSData.MAV, this.CVSSData.MAC, this.CVSSData.MPR, this.CVSSData.MUI, this.CVSSData.MS,
            this.CVSSData.MC, this.CVSSData.MI, this.CVSSData.MA);
        if (cvssResult.success) {
            this.baseMetricScore = cvssResult.baseMetricScore
            this.environmentalMetricScore = cvssResult.environmentalMetricScore;
            this.temporalMetricScore = cvssResult.temporalMetricScore;
            this.vectorString = cvssResult.vectorString;
            this.chartData = [this.baseMetricScore, this.environmentalMetricScore, this.temporalMetricScore];
            this.cvssValid = true;
        }
        else {
            this.cvssValid = false;
            this.baseMetricScore = "NA";
            this.environmentalMetricScore = "NA";
            this.temporalMetricScore = "NA";
            this.vectorString = "";
            this.chartData = [];
        }
        console.log(cvssResult);
    };



    this.chartLabels = ["מדדי בסיס", "מדדים זמניים", "מדדים סביבתיים"];
    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };


    var vectorFromUrl = $location.search().vector;
    if (vectorFromUrl) {
        var scores = vectorFromUrl.split('/');
        angular.forEach(scores, function (v) {
            var score = v.split(':');
            this.CVSSData[score[0]] = score[1];
        }, this);
        this.setScore();
    }


}]);


app.config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
        'smart': true,
        'size': 'large',
        'speed': 'medium',
        'side': 'bottom',
        'tooltipTemplateUrlCache': true,
        'tooltipClass': 'cvss-tooltip'
    });
}])


app.config(function ($translateProvider) {
    $translateProvider.translations('he', {
        HEADLINE: 'Common Vulnerability Scoring System Calculator',
        SUBHEADER: 'This page shows the components of the CVSS score for example and allows you to refine the CVSS base score. Please read the CVSS standards guide to fully understand how to score CVSS vulnerabilities and to interpret CVSS scores. The scores are computed in sequence such that the Base Score is used to calculate the Temporal Score and the Temporal Score is used to calculate the Environmental Score.',
        AV: 'מדד זה משקף את ההקשר שבו ניצול הפגיעויות הוא אפשרי. הערך של מדד זה (ובהתאם גם הציון המתקבל) יהיה גדול יותר ככל שהתוקף יהיה יותר מרוחק (לוגית ופיזית) על מנת לנצל את הרכיב הפגיע.',
        AVN: 'פגיעות ניתנת לניצול בגישה לרשת משמע שהרכיב הפגיע מחובר לרשת והנתיב של התוקף עובר בשכבת OSI 3(שכבת הרשת). פגיעות שגזו לרוב נקראת "ניתנת לניצול מרחוק" ויכולה להיחשב ',
        AVA: 'נקודה פגיעה שניתנת להיצול עם גישה לרשת סמוכה, כלומר שהרכיב הפגיע מחובר לרשת, ועם זאת המתקפה מוגבלת לרשת המשותפת הפיזית (כמו בלוטות, IEEE 802.11) או הלוגית (IP מקומי) ולא יכולים להתבצע בגבול שכבת OSI 3(למשל ראוטר). דוגמא למתקפה מרשת סמוכה היא ARP (IPv4) או הצפה באמצעות גילוי שכן (IPv6) שמובילה לדחיית שירותים בLAN המקומי. ראו גם CVE 2013 6014.',
        AVL: 'נקודה פגיעה ניתנת XXXX באמצעות גישה מקומית, כלומר שהרכיב הפגיע לא מחובר לרשת, והנתיב של התוקף עובר דרך יכולות קריאה, כתיבה או ביצוע. במקרים מסוימים, התוקף יכול להיות מחוברת באופן מקומי על מנת לנצל את הנקודה הפגיעה, אחרת, התקיפה תסתמך על אינטראקציית משתמש על מנת לשגר קובץ זדוני.',
        AVP : 'נקודת פגיעה ניתנת לניצול באמצעות גישה פיזית דורשת מהתוקף לגעת פיזית או לבצע מניפולציות על הרכיב הפגיע. אינטראקציה פיזית יכולה להיות קצרה (למשל "evil maid attack") או מתמשכת. דוגמא לתקיפה שכזו היא תקיפת cold boot שמאפשרת לתוקף גישה להצפנת מפתחות דיסק לאחר השגת גישה פיזית למערכת, או מתקפות היקפיות כמו Firewire/מתקפות עם USB בעל גישה ישירה לזכרון.',
        AC: 'מדד זה מתאר את התנאים שמעבר לשליטתו של התוקף שחייבים להתקיים על מנת לנצל את הפגיעות. כפי במתואר מטה, תנאים אלה דורשים אוסף של מידע נוסף לגבי המטרה, נוכחות של מספר הגדרות תצורה של המערכת, או חריגות חישוביות.',
        ACL: 'תנאי גישה מיוחדים או תנאים מקלים לא קיימים. התוקף יכול לצפות להצלחה שחוזרת על עצמה כנגד הרכיב הפגוע.',
        ACH: 'התקפה מוצלחת תלויה בתנאים שמעבר לשליטת התוקף. כלומר, התקפה מוצלחת לא תתקיים רק מרצון, אלא דורשת מהתוקף להשקיע מאמץ לא קטן בהכנות או בביצועים כנגד הרכיב הפגוע לפני שניתן לצפות להתקפה מוצלחת. למשל, התקפה מוצלחת יכולה להיות תלויה בתוקף שיתגבר על מספר תנאים.',
        PR: 'מדד זה מתאר את רמת הפריבילגיות שהתוקף צריך שיהיו לו לפני ניצול מוצלח של הפגיעות.',
        PRN: 'התוקף לא מורשה לפני התקיפה, ולכן לא נדרש לגישה לקבצים או הגדרות על מנת לבצע התקפה.',
        PRL: 'התוקף מורשה עם (כלומר נדרש) פריבילגיות שמספקות יכולות משתמש בסיסיות שיוכלות להשפיע בשגרה רק על הגדרות או קבצים בבעלות המשתמש. לחלופין, תוקף עם רמה נמוכה של פריבילגיות בעל יכולת להשפיע רק על משאבים לא רגישים.',
        PRH: 'התוקף מורשה עם (כלומר נדרש) פריבילוגיות שמספקות שליטה משמעותית (למשל אדמיניסטריבית) על הרכיב הפגיע שיכולה להשפיע על הגדרות התקפות לכל הרכיבים או קבצים.',
        UI: 'מדד זה מתייחס לדרישה מהמשתמש, ולא מהתוקף, להשתתף בפגיעה מוצלחת ברכיב הפגיע. המדד הזה קובע האם הפגיעות יכולה להיות מנוצלת בכל עת שהתוקף רוצה, או שצריך משתמש נפרד (או תהליך שמשתמש מתחיל) שישתתף באופן כלשהו.',
        UIN: 'המערכת הפגיעה יכולה להיות מנוצלת ללא אינטראקציה מאף משתמש.',
        UIR: 'ניצול מוצלח של הנקודה הפגיעה דורשת ממשתמש לבצע פעולה כלשהי לפני שניתן לנצל את הנקודה הפגיעה. למשל, ניצול מוצלח יכול להיות אפשרי רק כאשר אדמיניסטרטור של המערכת מתקין תוכנה כלשהי.',
        S: 'ערך חשוב שנתפס ע"י CVSS גרסה 3.0 היא היכולת של פגיעות ברכיב תוכנה אחד להשפיע על משאבים מחוץ לאמצעים או לפריבילגיות שלו. השלכה זו מיוצגת ע"י המדד מרחב הרשאה, או בקיצור מרחב.באופן רשמי, מרחב מתכוון לאוסף הפריבילגיות המוגדרות עי הרשאת מחשב (למשל אפליקציה, מערכת הפעלה, או סביבת sandbox) בה ניתנת גישה למשאבי מחשב (למשל קבצים, מעבד, זיכרון וכדומה).',
        SU: 'נקודה פגיעה ניתנת לניצול שמשפיעה רק על משאבים המנוהלים ע"י אותה הסמכות. במקרה זה הרכיב הפגיע והרכיב שמושפע הם אותו אחד.',
        SC: 'נקודה פגיעה ניתנת לניצול שיכולה להשפיע משאבים מעבר לפריבילגיות הסמכות שניתנו על ידי הרכיב הפגיע. במקרה זה הרכיב הפגיע והרכיב המושפע הם שונים.',
        C: 'מדד זה מודד את ההשפעה על הסודיות של משאבי מידע המנוהלים ע"י רכיבי תוכנה בעקבות ניצול מוצלח של נקודה פגיעה. סודיות מתייחסת להגבלת גישה וגילוי של מידע למשתמשים מורשים בלבד, כמו כן גם מניעת גישה או גילוי של מידע למשתמשים לא מורשים.',
        CH: 'אובדן מוחלט של סודיות, שגורם לכל המשאבים ברכיב המושפע להתגלות לתוקף. לחלופין, מתקבלת גישה רק לחלק מהמידע המוגבל, אבל המידע המוצג מייצג השפעה ישירה ורצינית. למשל, תוקף גונב סיסמא של אדמיניסטרטור או מפתחות מוצפנים פרטיים של שרת אינטרנט.',
        CL: 'ישנו אובדן כלשהו של סודיות. מתקבלת גישה לחלק מהמידע המוגבל, אבל התוקף אינו בעל שליטה על המידע שהוא מקבל, או על כמות או סוג האובדן שמתרחש. גילוי המידע לא גורם לאובדן ישיר ורציני על הרכיב המושפע.',
        CN: 'אין אובדן סודיות בתוך הרכיב המושפע.',
        I: 'מדד זה מעריך את ההשפעה על האמינות של ניצול מוצלח של נקודה פגיעה. אמינות הכוונה לאמינות ואמיתות של מידע.',
        IH: 'אובדן מוחלט של אמינות, או אובדן מוחלט של הגנה. למשל, התוקף יכול לשנות את כל הקבצים המוגנים ע"י הרכיב המושפע. לחלופין, רק חלק מהקבצים יכולים להשתנות, אך שינויים זדוניים יהיו מוצגים כהשלכה ישירה ורצינית על הרכיב המושפע.',
        IL: 'ניתן לבצע שינויים לדאטה, אך לתוקף אין שליטה על ההשלכות של שינוי, או על כמות השינוי שהוא יכול לאלץ. שינוי הדאטה אינו בכל השפעה ישירה ורצינית על הרכיב המושפע.',
        IN: 'אין אובדן אמינות בתוך הרכיב המושפע.',
        A: 'מדד זה מעריך את ההשפעה על זמינות של רכיב מושפע שנוצרת מניצול מוצלח של נקודה פגיעה. בעוד שמדדי האמינות והסודיות מדברים על אובדן סודיות או אמינות של דאטה (למשל מידע, קבצים) שהרכיב המושפע משתמש בהם, מדד זה מתכוון לאובדן זמינות של הרכיב הנפגע עצמו, כמו שירות ברשת (למשל אינטרנט, מאגר מידע, אימייל). כיוון שזמינות מתייחסת לנגישות של משאבי מידע, התקפות שמשתמשות ברוחב פס של הרשת, מחזורי מעבד או מקום בדיסק משפיעות על הזמינות של רכיב פגוע.',
        AH: 'קיים אובדן זמינות, שמוביל ליכולת של התוקף לדחות לחלוטין גישה למשאבים ברכיב המושפע, אובדן זה יכול להיות ממושך (בעוד שהתוקף ממשיך לתקוף) או מתמיד (התנאי ממשיך למרות שההתקפה הושלמה). לחלופין, לתוקף יש את היכולת לדחות חלק מהזמינות, אך האובדן מייצג השלכה ישירה ורצינית על הרכיב המושפע (למשל התוקף לא יכול להפריע לחיבורים קיימים אך הוא יכול למנוע חיבורים חדשים; התוקף יכול לנצל שוב ושוב נקודה פגיעה ובכל התקפה מוצלחת לגרום לדליפה קטנה של זיכרון, אך לאחר מספר ניצולים לגרום לשירות להיות לא זמין כלל).',
        AL: 'ישנה הורדה בביצועים או הפרעות בזמינות המשאבים. אפילו אם ניתן לבצע ניצולים נשנים של נקודה הפגיעה, התוקף אינו בעל יכולת לדחות לחלוטין שירותים למשתמשים לגיטימיים. המשאבים ברכיב המושפע זמינים לסירוגין או כל הזמן, או זמינים לחלוטין רק חלק מהזמן, אך בסך הכל אין השלכה ישירה ורצינית על הרכיב המושפע.',
        AN: 'אין השפעה על זמינות בתוך הרכיב המושפע.'
    });
    $translateProvider.preferredLanguage('he');
});
