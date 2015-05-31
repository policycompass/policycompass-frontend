angular.module('pcApp.common.directives.wizard', [

])


.factory('WizardMainData', ['dialogs', '$log', '$location', function(dialogs, $log, $location) {
    return {
		
		baseWizardMainDataController: function($scope) 
		{

			var locationURL = $location.url();
			var searchObject = $location.search();
			
			if (locationURL.indexOf("pillar") > -1)
			{				
				$scope.tabSelected = searchObject['pillar'];				
			}
			else
			{
				$scope.tabSelected=0;
			}
			//$scope.tabSelected='eval';
			
				
				$scope.selecttab = function(tab) {
					$scope.tabSelected=tab;
					
					$scope.textstep = $scope.pillars[tab]['steps'];
					/*
					if (tab=='eval')
					{
						$scope.textstep=$scope.textEvalStep;
					}
					else if (tab=='build')
					{
						$scope.textstep=$scope.textBuildStep;
					}
					else if (tab=='deliberate')
					{
						$scope.textstep=$scope.textDeliberateStep;
					}
					*/
				}
				
				
				
				$scope.textEvalStep = [];

				//$scope.textEvalStep[1]={'title':'Metrics definition', 'text':'Import data using the Metrics Metadata Editor Wizard', 'class':'want-item-import'};

				$scope.textEvalStep[0]={'title':'Data discovery and processing', 'text':'The first step starts in the mind of the user. She or he has to think about what subject to analyse. In general, there can be three different approaches. On the one hand, a user could be interested in a certain policy and would like to understand its effects and side effects. Then, the user would reason about possible areas on which the policy could have impacts and search for appropriate data. On the other hand, the user could already have the measurable real world phenomenon in mind. Maybe, there are distinctive features that he or she wants to understand better, being in search for an explanatory reason. The third possible approach is of a user wanting to measure a specific indicator based on his or her assumptions and notions.  In all cases, the user would have to find the appropriate data. If the data is not already present in Policy Compass (the user can use a faceted search on Policy Compass to find data), it would need to be found elsewhere and uploaded to Policy Compass first. A wizard will make it easy for the user to import the data tables into the Policy Compass system and define the indicator that this data represents.', 'class':'want-item-search', 'link':'browse'};
				$scope.textEvalStep[1]={'title':'Metrics definition', 'text':'Once the data is in Policy Compass, the user can move on to creating a metric that measures a certain property of his/her choosing. A metric can be defined by creating a formula that consists of one or more variables that indicate a measurable ‘something’ that represents current situations over a period of time. The user may also select pre-defined sophisticated metrics on Policy Compass to add to the formula and set up a composite metric. These metrics are given appropriate weights and normalisation functions by the user. The newly created metric can then be shared among peers, in Policy Compass or social networks and be put up for discussions and debates, for instance, on how adequate the selected indicators are.', 'link':'metrics/create'};								
				$scope.textEvalStep[2]={'title':'Metrics operationalisation, visualisation and comparison', 'text':'Once both data and metrics are at hand, the user can start combining both for the analysis. Operationalising a metric denotes applying real world datasets to a formula and calculating new values. In doing so, the user may opt for one of the following methods: 1.The user can start by selecting a metric to operationalise followed by selecting adequate datasets to be applied to the indicators in the metric’s formula. This process can be applied to different regions to facilitate a comparison for instance between two different countries. 2. The user can select appropriate datasets associated with a specific indicator and use them to operationalise two or more different metrics that measure the indicator in mind. This method can be applied to facilitate a comparison between metric definitions (Which metric is more suitable to measure the indicator in mind?). The results can be shown using appropriate visualisation styles that simplify the comparison and understanding of trend lines.', 'class':'want-item-metrics', 'link':'metrics'};				
				$scope.textEvalStep[3]={'title':'Improving understanding of the data', 'text':'Applying datasets to metrics describes a real world situation. The selection of metrics and their construction or the specific selection of data (depending on the starting point) already contains implications on the reasons or the processes behind it. However, the user needs ways to finding events that could have (had) a causal effect on the real world situation represented by the data. First, searching for possible explanations one would concentrate first on incidents, political decisions, developments in society, etc. that are within the subject area of study. Second, one would look for events that occurred around time points where data shows abnormalities. In Policy Compass, the connection between events and data is made by annotating graph time line with selected events.', 'class':'want-item-create', 'link':'visualizations/create'};				
				$scope.textEvalStep[4]={'title':'Seeking explanation of policy impacts', 'text':'Connecting events with data provides a description of data. In addition to that, Policy Compass will support the analyses in order to identify causation. Therefore, once the data is annotated, the user can search for causal policy models that could explain the data. Such a model would help to identify which factors contributed to a certain policy output or impact. For example, this could reveal that the data did not improve after a policy change but remained stable or that certain changes suggest a previously neglected cause. The causal policy models would also provide an understanding of the comparative quantification of different factors. Based on the selected metrics and the selected properties, the user could search for existing causal policy models or build an own model. The latter is described in more detail from the causal policy modeller perspective in the pillar “Building Causal Policy Models.', 'link':'browse'};				
				$scope.textEvalStep[5]={'title':'Sharing knowledge and results', 'text':'After defining metrics, describing the data and analysing it in more detail, the user wants to share his or her insights and put them up for discussion with others. In order to disseminate the generated metrics, visualisations (with connected events), and the results of the applications of causal policy models, users should be able to use established Web 2.0 channels (for example, social networks, blogs, etc.). While sharing is easy in the Social Web, the argument based discussion is somewhat more difficult. Policy Compass, however, provides the necessary ways with a deliberation tool. It will facilitate debates about both the composition of metrics and the actual effects of policies. The details of this perspective will be described in the ‘Policy Impact Deliberation and Argument Mapping’ pillar.', 'class':'want-item-embed', 'link':'browse'};
				//$scope.textEvalStep[6]={'title':'Embed', 'text':'Embed data', 'class':'want-item-embed'};
				
				$scope.textBuildStep = [];
				$scope.textBuildStep[0]={'title':'Creating/refining causal models', 'text':'Assuming the user has the necessary data at hand that is related to policies of interest, the user can create a causal policy model using the a graphical model editor in the Policy Compass Platform, by adding concepts and their relationships to form a directed graph. In a causal policy model concepts have underlying datasets related to policies. The relationships can be determined based on the knowledge of the user as well as the data at hand. Another way to develop a causal model is to copy an existing one and modify it. Policy Compass provides a powerful search tool to browse existing user generated content.', 'class':'want-item-cognitive', 'link':'models/create'};
				$scope.textBuildStep[1]={'title':'Turning causal networks to Fuzzy Cognitive Map', 'text':'After creating, editing or modifying a causal model, the user can turn the causal policy model into a Fuzzy Cognitive Map by assigning a fuzzy value to the concept and relations between them. The user can then set the scale of the fuzzy value for each concept and the weight can be determined by the user or can be calculated automatically based on the historical data.', 'class':'want-item-cognitive', 'link':'models'};				
				$scope.textBuildStep[2]={'title':'Simulating FCMs and visualising impacts', 'text':'With a complete FCM, a user can run a simulation to predict and understand the future values of each concept. This might be the first step in analysing policy impacts by letting users understand the possible scenario of the future based on their model. Users can also compare the simulation result with regards to the change of the fuzzy value of one concept.', 'class':'want-item-cognitive', 'link':'browse'};
				$scope.textBuildStep[3]={'title':'Sharing knowledge and results', 'text':'Both the FCM models and the simulation results can be saved under a user account and shared with others via social networks and web 2.0 channels.', 'class':'want-item-embed', 'link':'browse'};
			
				$scope.textDeliberateStep = [];
				$scope.textDeliberateStep[0]={'title':'Initiate and participate in deliberations. Using Adhocracy', 'text':'Create a topic for some issue. Issues can be linked to and reference passages of text in external documents, such as party programs, position papers or design documents. Participate in a threaded discussion of the topic by making proposals for resolving the issue, making arguments pro or con proposals, commenting on proposals (without putting forward pro or con arguments).	Agree (+1) or disagree (-1) with proposals, arguments and comments, to influence the ranking of articles using social filtering, in the manner of Reddit.', 'class':'want-item-adhocracy', 'link':'browse'};				
				$scope.textDeliberateStep[1]={'title':'Transform structured discussions into argument maps. Using Carneades', 'text':'Summarize the arguments pro and con of each proposal, by interpreting the texts of the arguments to identify (reconstruct) the premises and conclusion of each argument. Use conventional patterns of argument, called argumentation schemes, to classify the arguments and check their validity, that is to check whether they correctly apply to argumentation schemes accepted as best practice by the community. Have any premises been left implicit? Do the premises and conclusion fit the normative pattern of some accepted argumentation scheme? Use the argument schemes to guide the reconstruction of arguments when interpreting the texts. Give participants the benefit of the doubt, by preferring interpretations which correctly apply the schemes accepted by the community. Link the arguments to original source proposals and comments in Adhocracy, with citations and quotes, with representative examples of formulations of each argument. If two comments make the same argument, it should be reconstructed only once, but can be linked to and cite multiple formulations in the comments. Link the arguments together into an argument graph, where the conclusion of one argument is the premise of another argument. Visualize the argument graph in an argument map, to allow users to obtain a summary overview of the arguments.', 'class':'want-item-carneadas', 'link':'browse'};
				$scope.textDeliberateStep[2]={'title':'Navigate argument maps. Using Carneades', 'text':'Generate a structured, online survey from the argument graph, to help participants to navigate the map and formulate informed opinions about the merits of each proposal and to obtain feedback from them about their agreement or disagreement with the premises of the arguments, and their opinion of the relative weight or persuasiveness of conflicting arguments. Apply a computational model of structured argument to formally evaluate the arguments, taking into consideration the collective opinion of the users, from the survey results, to determine which proposals are best supported by the arguments put forward thus far. (Argumentation logic is "nonmonotonic", so further arguments can cause the ranking of proposals to change.) Publish the argument maps and survey results in Adhocracy and use them to inform the next round of discussion of the issues, using argumentation schemes to suggest critical questions which may be asked, or help users to sharpen their understanding of the issues and arguments before voting on proposals. Now that we have shown the process model for PIDAM, using the deliberation and argument tool we now present an outline of possible policy impact deliberations that can be raised during the construction and application of performance metrics and causal models (the first two pillars, EPP and BCPM) to prove that at each step of the pillars a deliberation can take place as part of an iterative process to improve on ideas and the user generated content.', 'class':'want-item-carneadas2', 'link':'browse'};
			
				
				$scope.pillars = [];
				$scope.pillars[0]={'title':'Evaluate Performance of Policies', 'shortname':'EPP', 'label':'eval', 'steps': $scope.textEvalStep};
				$scope.pillars[1]={'title':'Build Causal Policy Models', 'shortname':'BCPM', 'label':'build', 'steps': $scope.textBuildStep};
				$scope.pillars[2]={'title':'Policy Impact Deliberation and Argument Mapping', 'shortname':'PIDAM', 'label':'deliberate', 'steps': $scope.textDeliberateStep};
				
				
				$scope.textstep = [];
				//$scope.textstep=$scope.textEvalStep;
				$scope.textstep = $scope.pillars[0]['steps'];
			
    	}
    	
    }
}])			

//example of use:
//<div class="wizardbar"></div>
.directive('wizardbar', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        }, 
        controller: function($scope, $element, $attrs, $location, dialogs, WizardMainData ){

			WizardMainData.baseWizardMainDataController($scope);
			
			$scope.help = false;
			$scope.step = "";
			
			var locationURL = $location.url();
			var searchObject = $location.search();
			
			if (locationURL.indexOf("help") > -1)
			{				
				$scope.help = searchObject['help'];				
			}
			if (locationURL.indexOf("step") > -1)
			{				
				$scope.step = searchObject['step'];				
			}
			if (locationURL.indexOf("pillar") > -1)
			{				
				$scope.pillar = searchObject['pillar'];				
			}		

		
			$scope.textstep=$scope.textEvalStep;
			
			if ($scope.pillar)
			{
				$scope.textstep = $scope.pillars[$scope.pillar]['steps'];	
			}
			
        },

        template: ''+       
		'<div ng-show="help" class="help-guide help-active" id="help-guide">'+
		'<a class="help-nav-whant" href="#/i-want-to?pillar={{pillar}}" ng-click="help=false"></a>'+
		'<a class="help-nav-close" href="" ng-click="help=false"></a><br/>'+
  		'<a ng-hide="step==0" href="/#/{{textstep[(step - 0 )-1][\'link\']}}?help=true&pillar={{tabSelected}}&step={{(step - 0 )-1}}" class="help-nav help-nav-prev"></a>'+  		
  		'<p>'+
  		'<strong>{{pillars[pillar][\'title\']}}. {{textstep[step][\'title\']}}:</strong><br/>'+
  		'{{textstep[step][\'text\']}}'+
  		'</p>'+
  		'<a ng-hide="(textstep.length-1)==step" href="/#/{{textstep[(step - 0)+1][\'link\']}}?help=true&pillar={{tabSelected}}&step={{(step - 0)+1}}" class="help-nav help-nav-next"></a>'+
		'</div>'		
    };
}])




.directive('wizardform', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        }, 
        controller: function($scope, $element, $attrs, $location, dialogs, WizardMainData){
			WizardMainData.baseWizardMainDataController($scope);			
        },

        template: ''+                
		'<div class="content want-to-page" id="">'+
				'<div class="content-inner">'+				
					'<div class="head-wrap">'+
						'<center>'+					
						//	'<h2 class="page-title">I want to</h2>'+										
							'<ul class="toc">'+
								'<li ng-repeat="pillar in pillars track by $index" ng-class="{\'current active\': tabSelected>=$index, \'inactive\': tabSelected<$index}">'+
								'<a href="" ng-click="selecttab($index)">{{pillar[\'shortname\']}}<br>'+
								'{{pillar[\'title\']}}</a>'+
								'</li>'+
		          			'</ul>'+
		          		'<center>'+
					'</div>'+	        	
		        	'<div>'+
		        		'<center>'+
				        	'<ul class="want-list" id="want-list-evaluate">'+				        	
				        		'<li ng-repeat="stepData in textstep track by $index" class="want-item {{stepData[\'class\']}}">'+
				        			'<h3 class="want-item-title">'+
				        				'<a href="/#/{{stepData[\'link\']}}?help=true&pillar={{tabSelected}}&step={{$index}}" >{{$index+1}}. {{stepData[\'title\']}}</a>'+
				        			'</h3>'+
				        		'</li>'+
							'</ul>'+
						'</center>'+
    				'</div>'+
		      '</div>'+ 
		    '</div>'
    };
}])
