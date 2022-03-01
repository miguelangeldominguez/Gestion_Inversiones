import { s, sA, get, post } from "./../app.js";
import { getUser } from "../utilities.js";
import { TableList } from "../contentManager.js";

const DIR = "php/devices/";
let admin = false;

//cargar la consulta
export function cargarConsulta(id) {
	post(DIR + "device-single.php", { id }, function (device) {
		let inputs = s(".form-edit");

		inputs.forEach(input => {
			input.value = device[input.getAttribute("name")];
		});

		//s("#id").innerHTML = device.id;
		if (device.foto == undefined) {
			s(".card-img-top").src = "img/noImage.png";
		} else {
			s(".card-img-top").src = "img/phones/" + device.id + device.foto;
		}
	});
}

//Cerrar Sesion
function closeSession() {
	get("php/close.php", r => {
		window.location = "index.html";
	});
}

s("#close").addEventListener("click", () => {
	closeSession();
});

export var tableList = new TableList({id: "modelo", action: () => {}}, DIR, admin);

// Load User
getUser(user => {
	if (user.range > 1) {
		admin = true;

		let script = document.createElement("script");
		script.setAttribute("type", "module");
		script.src = 'js/devices/root.js';
		s("body").appendChild(script);
	}	
});

//Search
document.addEventListener("DOMContentLoaded", function () {

	s('#search').addEventListener("keyup", () => {
		let search = s('#search');

		if (search.value) {
			search = search.value;

			post(DIR + 'device-search.php', { search }, devices => {
				let template = '';

				devices.forEach(device => {
					template += `<li><a deviceId="${device.id}" class="device-search-item" href="#">${device.modelo}</a></li>`;
				});

				if (devices == '') {
					s('#container').innerHTML = `No results for the search.`;
				} else {
					s("#container").innerHTML = template;

					sA(".device-search-item").forEach(b => {
						b.addEventListener("click", () => {
							cargarConsulta(b.getAttribute("deviceId"));
						});
					});

					if(admin){
						sA(".device-search-item").forEach(b => {
							b.addEventListener("click", () => {
								let id = b.getAttribute("deviceId");
								let d = s(`tr[deviceid='${id}']`).getAttribute("d") == "true" ? false : true;
								showControlQuery(d);
							});
						});
					}
				}
				s('#search-result').style.display = "block";
			});
		} else {
			s('#search-result').style.display = "none";
		}
	});
});
