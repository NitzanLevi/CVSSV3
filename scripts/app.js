var app = angular.module('CVSSApp', ['ui.bootstrap', 'sticky', 'chart.js','pascalprecht.translate','720kb.tooltips']).config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.controller('CVSSController', ['$scope','$location', function($scope,$location) {
    this.baseMetricScore = "NA";
    this.environmentalMetricScore = "NA";
    this.temporalMetricScore = "NA";
    this.vectorString = "";
    this.baseURL = "https://nitzanlevi.github.io/CVSSV3/";
    //this.baseURL =  "http://127.0.0.1:52079/index.html";
    this.cvssValid = false;


    this.CVSSData={
        CVSS : "",        
        AV : "",        
        AC : "",
        PR : "",
        UI : "",
        S : "",
        C : "",
        I : "",
        A : "",
        E : "X",
        RL : "X",
        RC : "X",
        MAV : "X",        
        MAC : "X",
        MPR : "X",
        MUI : "X",
        MS : "X",
        MC : "X",
        MI : "X",
        MA : "X",
        CR : "X",
        IR : "X",
        AR : "X"
    };

    this.setScore = function(){
        var cvssResult = CVSS.calculateCVSSFromMetrics(
            this.CVSSData.AV, this.CVSSData.AC, this.CVSSData.PR, this.CVSSData.UI, this.CVSSData.S, this.CVSSData.C, this.CVSSData.I, this.CVSSData.A,
            this.CVSSData.E, this.CVSSData.RL, this.CVSSData.RC,
            this.CVSSData.CR, this.CVSSData.IR, this.CVSSData.AR,
            this.CVSSData.MAV, this.CVSSData.MAC, this.CVSSData.MPR, this.CVSSData.MUI, this.CVSSData.MS,
            this.CVSSData.MC, this.CVSSData.MI, this.CVSSData.MA);
        if (cvssResult.success)
        {
            this.baseMetricScore = cvssResult.baseMetricScore
            this.environmentalMetricScore = cvssResult.environmentalMetricScore ;
            this.temporalMetricScore = cvssResult.temporalMetricScore;
            this.vectorString = cvssResult.vectorString;
            this.chartData = [ this.baseMetricScore, this.environmentalMetricScore ,this.temporalMetricScore];
            this.cvssValid = true;
        }
        else{
            this.cvssValid = false;
            this.baseMetricScore = "NA";
            this.environmentalMetricScore = "NA";
            this.temporalMetricScore = "NA";
            this.vectorString = ""; 
            this.chartData = [];
        }
        console.log(cvssResult);
    };



    this.chartLabels =["מדדי בסיס","מדדים זמניים","מדדים סביבתיים"];
    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };


    var vectorFromUrl = $location.search().vector;
    if (vectorFromUrl)
    {
        var scores = vectorFromUrl.split('/');
        angular.forEach(scores, function(v) {
            var score = v.split(':');
            this.CVSSData[score[0]] = score[1];
        },this);
    }


}]);


app.config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
  tooltipsConfProvider.configure({
    'smart':true,
    'size':'large',
    'speed': 'fast',
    'side':'bottom',
    'tooltipTemplateUrlCache': true
  });
}])


app.config(function($translateProvider) {
    $translateProvider.translations('he', {
        HEADLINE: 'Common Vulnerability Scoring System Calculator',
        AV : 'כותרת וקטור תקיפה',
        AVN : 'AVN',
        AVA: 'ניצן'
    });
    $translateProvider.preferredLanguage('he');
});
