$(document).ready(function(e) {
	$("#registration").submit(function() {
        
		return false;
    });
    $("#registration input").keyup(function(e) {
        if($(this).val().length==0)
		{
			$("#registration button").addClass("disabled");
			$("#label-"+ $(this).attr("id")).addClass("label-warning")
				.removeClass("label-important")
				.removeClass("label-success")
				.text("Champ vide");
		}
		else
		{
			$("#registration button").removeClass("disabled");
		}
    });
});
function checkName(pseudo){
	pseudo = pseudo.replace(/@[^\w\s]|_/g, "").replace(/\s+/g,"");
	$("#pseudo").val(pseudo);
	$.get("/checkPseudo/"+pseudo,function(data){
		if(data == '1')
		{
			$("#label-pseudo").addClass("label-important")
				.removeClass("label-success")
				.removeClass("label-warning")
				.text("Pseudo indisponible");
		}
		else
		{
			$("#label-pseudo").addClass("label-success")
				.removeClass("label-important")
				.removeClass("label-warning")
				.text("Pseudo disponible");
		}
	});
}

function checkPassword(password)
{
	password = password.replace(/@[^\w\s]|_/g, "").replace(/\s+/g,"");
	$("#pswd").val(password);
	if(password.length>0&&password.length<8)
	{
		$("#label-pswd").addClass("label-important")
			.removeClass("label-success")
			.removeClass("label-warning")
			.text("Le mot de passe doit avoir au moins 8 caractères");
			$("#chkpswd").attr("disabled","disabled");
	}
	else if(password.length==0)
	{
		$("#chkpswd").attr("disabled","disabled");
	}
	else
	{
		$("#chkpswd").removeAttr("disabled");
		$("#label-pswd").addClass("label-success")
			.removeClass("label-important")
			.removeClass("label-warning")
			.text("Mot de passe valide");
	}
}

function recheckPassword(password)
{
	if(password != $("#chkpswd").val())
	{
		$("#label-chkpswd").addClass("label-important")
			.removeClass("label-success")
			.removeClass("label-warning")
			.text("Les mots de passe ne correspondent pas");
	}
	else
	{
		$("#label-chkpswd").addClass("label-success")
			.removeClass("label-important")
			.removeClass("label-warning")
			.text("Les mots de passe correspondent");
	}
}

function checkMail(mail)
{
	$.get("/checkMail/"+mail, function(data){
		if(data.split(":")[0]=="Fail")
		{
			switch(data.split(":")[1])
			{
				case '0':
					$("#label-mail").addClass("label-warning")
						.removeClass("label-success")
						.removeClass("label-important")
						.text("Domaine inexistant");
					break;
				case '1':
					$("#label-mail").addClass("label-important")
						.removeClass("label-warning")
						.removeClass("label-success")
						.text("Adresse déjà utilisée");
					break;
			}
		}
		else
		{
			$("#label-mail").addClass("label-success")
				.removeClass("label-warning")
				.removeClass("label-important")
				.text("Adresse disponible");
		}
	});
}