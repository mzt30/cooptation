'use strict';

angular.module('CoopteUnDevApp',[]);

angular.module('CoopteUnDevApp').controller('CoopteUnDevCtrl', function ($scope, $window) {
	// Var
	
	$scope.listeCoopte = [];
	
	//objet user
	$scope.userCoopte = {};	
	
	//liste des lots
	$scope.listeLots = [{"nom":"DVD"}, {"nom":"CD"}, {"nom":"rien"}];
	
	$scope.listeGains = [];
	
	$scope.socket = io();
	
	//sur l'évènement de modification de la liste de user
	$scope.socket.on('setListUser', function(list){
		$scope.listeCoopte = list;
		$scope.$apply();
	});
	
	//sur l'évènement de renvoie d'un user random
	$scope.socket.on('setRandomUser', function(user, index){
		if(user != undefined){
			$scope.listeGains.push({"lot":$scope.listeLots[index], "gagnant":user});
			$scope.$apply();
		}
	});	
	
	$( document ).ready(function() {
		$scope.socket.emit('getListUser');
	});
	
	$scope.socket.emit('getListUser');
	
	
	$scope.add = function(){
		//si tous les éléments du formulaire défini
		if($scope.userCoopte.civilite !== undefined 
			&& $scope.userCoopte.nom !== undefined 
			&& $scope.userCoopte.prenom !== undefined){
			$scope.userCoopte.jeton = 1;
			$scope.socket.emit('addUser', $scope.userCoopte);
			
			// Reinit l'user
			$scope.userCoopte = {};
		}
		else{
			//ouverture de la modal d'erreur de saisie
			$("#erreurSaisieModal").modal('show'); 
		}
	};
	
	$scope.delete = function(id){
		$scope.socket.emit('deleteUser', id);
	};
	
	//permet de lancer la loterie
	$scope.getWinners = function(){
		$scope.listeGains = [];
		var gagnant;
		
		
		
		for(var i = 0; i < $scope.listeLots.length; i++){
			$scope.socket.emit('getRandomUser', i);	
		}
		
		$("#gagnantModal").modal('show'); 
	}

});