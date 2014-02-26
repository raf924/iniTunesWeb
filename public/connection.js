$(document).ready(function() {
    $("#connect").submit(function(e) {
		$.get("/connect",$(this).serialize(),function(data){
			if(data.split(":")[0] == "Fail")
			{			
				switch(data.split(":")[1])
				{
					case '0':
						$("#ConnectAlert").append("Le pseudo indiqué ne figure pas dans notre base de données, s'il devrait y être car vous vous êtes inscrit précédemment, veuillez contacter le webmaster, sinon inscrivez-vous");
						break;
					case '1':
						$("#ConnectAlert").append("Le mot de passe indiqué ne correspond pas au pseudo, veuillez réessayer. Si vous ne vous rappelez plus de votre mot de passe, contactez le webmaster pour qu'il réinitialise votre mot de passe");
						break;
					case '2':
						$("#ConnectAlert").append("Vous ne pouvez pas vous connecter au site car votre compte a été bloqué. Pour connaitre les raisons de ce blocage ou demander à ce que votre compte soit de nouveau accessible, contactez le webmaster");
						break; 
						
				}
				$("#connectError").modal({show:true});
			}
			else
			{
				location.load("/");
			}
			});
			return false;
	});
});