(function($) {
    var form = $("#login-form"),
        formSubmitBtn = $(":submit", form),
        formErrMsgPlc = $(".error", form),
        userLogoutBtn = $("#user-logout");

    form.on("submit", function() {
        formSubmitBtn.button("loading");
        formErrMsgPlc.html("");

        $.ajax({
            url: "/login",
            method: "POST",
            data: form.serialize(),
            complete: function() {
                formSubmitBtn.button("reset");
            },
            statusCode: {
                200: function() {
                    form.html("Вы вошли в сайт").addClass("alert-success");
                    window.location.href = "/";
                },
                403: function(jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    formErrMsgPlc.html(error.message);

                    if (error.message === "Password is not correct") {
                        formErrMsgPlc.append("<a hef='#'>Восстановить пароль</a>")
                    } else {
                        formErrMsgPlc.append("<a hef='#'>Зарегистрироватьсяя</a>")
                    }
                }
            }
        });
        return false;
    });

    userLogoutBtn.on("click", function(e) {
        $.ajax({
            url: "/logout",
            method: "POST",
            complete: function() {
                location.reload();
            }
        });

        e.preventDefault();
    });
})(jQuery);