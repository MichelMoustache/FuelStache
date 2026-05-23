const FUELSTACHE_CSV = `track,car,fuel_per_lap_l,nrg_per_lap_pct,tyre_deg_per_lap_pct,usable_laps,confidence,avg_lap_time,source_file,tank_liters_assumed,tyre_deg_basis,worst_tyre,avg_tyre_deg_per_lap_pct
"Silverstone (International)","Ferrari 296 LMGT3","1.6","2.025","0.623","137","high","","","120","worst_tyre_per_lap","",""
"Barcelona","Ferrari 296 LMGT3","2.531","3.173","1.49","11","High","1:45.116","Barcelona 12 laps.xml","120","worst_tyre_per_lap","FL","0.998"
"Bahrain (outer)","Aston Martin Vantage AMR LMGT3 Evo","2.14","2.562","0.615","15","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","BMW M4 LMGT3","2.21","2.604","0.674","127","high","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Chevrolet Corvette Z06 LMGT3.R","2.24","2.65","0.6","14","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Ferrari 296 LMGT3","2.22","2.587","0.638","8","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Lamborghini Huracan LMGT3 Evo 2","2.77","2.647","0.694","19","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Lexus RC F LMGT3","2.53","2.6","0.82","17","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","McLaren 720S LMGT3 Evo","2.14","2.585","0.823","15","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Mercedes-AMG LMGT3","2.4","2.613","0.725","30","medium","","","120","worst_tyre_per_lap","",""
"Bahrain (outer)","Porsche 911 LMGT3 R (992)","2.3","2.52","0.64","5","low","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Aston Martin Vantage AMR LMGT3 Evo","3.21","3.874","0.958","37","medium","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","BMW M4 LMGT3","3.26","3.957","1.088","193","high","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Chevrolet Corvette Z06 LMGT3.R","3.36","3.983","1.186","35","medium","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Ferrari 296 LMGT3","3.03","4.1","1.2","19","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Ford Mustang LMGT3","3.24","4.014","1.367","25","medium","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Lamborghini Huracan LMGT3 Evo 2","4.06","4.014","1.186","16","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Lexus RC F LMGT3","3.83","4.135","1.112","19","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","McLaren 720S LMGT3 Evo","3.16","3.843","1.236","16","medium-low","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Mercedes-AMG LMGT3","3.67","4","1.215","24","medium","","","120","worst_tyre_per_lap","",""
"Bahrain (wec)","Porsche 911 LMGT3 R (992)","3.48","3.986","1.186","16","medium-low","","","120","worst_tyre_per_lap","",""
"Barcelona","Aston Martin Vantage AMR LMGT3 Evo","2.42","3.155","1.003","35","medium","","","120","worst_tyre_per_lap","",""
"Barcelona","BMW M4 LMGT3","2.77","3.08","1.302","51","high","","","120","worst_tyre_per_lap","",""
"Barcelona","Chevrolet Corvette Z06 LMGT3.R","2.9","3.2","1.575","18","medium-low","","","120","worst_tyre_per_lap","",""
"Barcelona","Ford Mustang LMGT3","2.42","3.263","1.222","38","medium","","","120","worst_tyre_per_lap","",""
"Barcelona","Lamborghini Huracan LMGT3 Evo 2","2.98","3.1","1.208","60","high","","","120","worst_tyre_per_lap","",""
"Barcelona","Lexus RC F LMGT3","2.95","3.045","1.345","126","high","","","120","worst_tyre_per_lap","",""
"Barcelona","McLaren 720S LMGT3 Evo","2.45","3.08","1.105","24","medium","","","120","worst_tyre_per_lap","",""
"Barcelona","Mercedes-AMG LMGT3","2.9","3.007","0.98","85","high","","","120","worst_tyre_per_lap","",""
"Barcelona","Porsche 911 LMGT3 R (992)","2.86","2.996","1.089","56","high","","","120","worst_tyre_per_lap","",""
"COTA","Aston Martin Vantage AMR LMGT3 Evo","3.35","3.848","1.574","37","medium","","","120","worst_tyre_per_lap","",""
"COTA","BMW M4 LMGT3","3.5","3.816","1.558","53","high","","","120","worst_tyre_per_lap","",""
"COTA","Chevrolet Corvette Z06 LMGT3.R","3.41","3.737","1.575","80","high","","","120","worst_tyre_per_lap","",""
"COTA","Ferrari 296 LMGT3","3.41","3.947","1.582","19","medium-low","","","120","worst_tyre_per_lap","",""
"COTA","Ford Mustang LMGT3","3.24","3.9","1.9","8","medium-low","","","120","worst_tyre_per_lap","",""
"COTA","Lexus RC F LMGT3","3.86","3.977","1.39","37","medium","","","120","worst_tyre_per_lap","",""
"COTA","McLaren 720S LMGT3 Evo","3.24","3.875","1.575","60","high","","","120","worst_tyre_per_lap","",""
"COTA","Mercedes-AMG LMGT3","3.57","3.806","1.587","88","high","","","120","worst_tyre_per_lap","",""
"COTA","Porsche 911 LMGT3 R (992)","3.53","3.806","1.57","57","high","","","120","worst_tyre_per_lap","",""
"COTA (national)","Aston Martin Vantage AMR LMGT3 Evo","2.36","2.746","0.831","15","medium-low","","","120","worst_tyre_per_lap","",""
"COTA (national)","BMW M4 LMGT3","2.3","2.592","1.132","29","medium","","","120","worst_tyre_per_lap","",""
"COTA (national)","Chevrolet Corvette Z06 LMGT3.R","2.51","2.685","1.187","226","high","","","120","worst_tyre_per_lap","",""
"COTA (national)","Ferrari 296 LMGT3","2.37","2.625","0.938","20","medium","","","120","worst_tyre_per_lap","",""
"COTA (national)","Ford Mustang LMGT3","2.18","2.592","1.008","62","high","","","120","worst_tyre_per_lap","",""
"COTA (national)","Lamborghini Huracan LMGT3 Evo 2","2.82","2.587","1.575","8","medium-low","","","120","worst_tyre_per_lap","",""
"COTA (national)","Lexus RC F LMGT3","2.5","2.691","0.972","38","medium","","","120","worst_tyre_per_lap","",""
"COTA (national)","McLaren 720S LMGT3 Evo","2.36","2.655","1.192","147","high","","","120","worst_tyre_per_lap","",""
"COTA (national)","Mercedes-AMG LMGT3","2.34","2.513","0.825","8","medium-low","","","120","worst_tyre_per_lap","",""
"COTA (national)","Porsche 911 LMGT3 R (992)","2.29","2.52","0.778","100","high","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Aston Martin Vantage AMR LMGT3 Evo","7.62","9.267","1.64","17","medium-low","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","BMW M4 LMGT3","7.56","9.336","1.404","31","medium","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Chevrolet Corvette Z06 LMGT3.R","7.88","9.222","1.511","9","medium-low","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Ferrari 296 LMGT3","7.93","9.447","1.606","21","medium","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Ford Mustang LMGT3","6.89","9.529","1.182","34","medium","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Lamborghini Huracan LMGT3 Evo 2","8.47","9.646","1.854","15","medium-low","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Lexus RC F LMGT3","8.14","9.373","1.96","17","medium-low","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","McLaren 720S LMGT3 Evo","7.22","9.153","1.476","42","medium","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Mercedes-AMG LMGT3","8.12","9.192","1.456","58","high","","","120","worst_tyre_per_lap","",""
"Circuit de la Sarthe","Porsche 911 LMGT3 R (992)","7.72","9.093","1.493","36","medium","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Aston Martin Vantage AMR LMGT3 Evo","2.76","3.05","1.275","8","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","BMW M4 LMGT3","2.59","2.953","1.187","36","medium","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Chevrolet Corvette Z06 LMGT3.R","2.8","2.967","1.117","6","low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Ferrari 296 LMGT3","2.69","3.047","2.14","17","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Ford Mustang LMGT3","2.52","3","1.383","14","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Lamborghini Huracan LMGT3 Evo 2","3.15","3.075","1.062","18","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Lexus RC F LMGT3","2.88","3.008","1.415","15","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","McLaren 720S LMGT3 Evo","2.5","3.003","1.269","76","high","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Mercedes-AMG LMGT3","2.88","3.045","1.631","35","medium","","","120","worst_tyre_per_lap","",""
"Fuji (chicane)","Porsche 911 LMGT3 R (992)","2.71","2.888","1.012","21","medium","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Aston Martin Vantage AMR LMGT3 Evo","2.76","3.033","1.2","60","high","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","BMW M4 LMGT3","2.53","3","0.95","40","medium","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Chevrolet Corvette Z06 LMGT3.R","2.57","3.029","1.182","19","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Ferrari 296 LMGT3","2.58","2.878","1.199","125","high","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Ford Mustang LMGT3","2.35","3.02","1.055","24","medium","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Lamborghini Huracan LMGT3 Evo 2","2.82","3.02","1.027","17","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Lexus RC F LMGT3","2.93","3.059","1.072","47","medium","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","McLaren 720S LMGT3 Evo","2.28","2.92","0.795","24","medium","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Mercedes-AMG LMGT3","2.67","2.875","1.1","18","medium-low","","","120","worst_tyre_per_lap","",""
"Fuji (classic)","Porsche 911 LMGT3 R (992)","2.53","2.962","0.794","38","medium","","","120","worst_tyre_per_lap","",""
"Imola","Aston Martin Vantage AMR LMGT3 Evo","3.24","3.777","1.404","32","medium","","","120","worst_tyre_per_lap","",""
"Imola","BMW M4 LMGT3","3.24","3.767","1.243","25","medium","","","120","worst_tyre_per_lap","",""
"Imola","Chevrolet Corvette Z06 LMGT3.R","3.31","3.88","1.275","24","medium","","","120","worst_tyre_per_lap","",""
"Imola","Ferrari 296 LMGT3","2.94","3.521","1.147","23","medium","","","120","worst_tyre_per_lap","",""
"Imola","Ford Mustang LMGT3","2.98","3.66","0.827","17","medium-low","","","120","worst_tyre_per_lap","",""
"Imola","Lexus RC F LMGT3","3.64","3.878","1.183","22","medium","","","120","worst_tyre_per_lap","",""
"Imola","McLaren 720S LMGT3 Evo","2.88","3.5","1.5","3","low","","","120","worst_tyre_per_lap","",""
"Imola","Mercedes-AMG LMGT3","3.19","3.5","1.243","7","low","","","120","worst_tyre_per_lap","",""
"Imola","Porsche 911 LMGT3 R (992)","3.05","3.5","1.247","17","medium-low","","","120","worst_tyre_per_lap","",""
"Interlagos","Aston Martin Vantage AMR LMGT3 Evo","2.22","3.1","0.863","70","high","","","120","worst_tyre_per_lap","",""
"Interlagos","BMW M4 LMGT3","2.43","2.849","0.9","103","high","","","120","worst_tyre_per_lap","",""
"Interlagos","Chevrolet Corvette Z06 LMGT3.R","2.48","2.967","1.717","6","low","","","120","worst_tyre_per_lap","",""
"Interlagos","Ferrari 296 LMGT3","2.269","2.991","0.98","11","High","1:37.091","Interlagos 12 laps.xml","120","worst_tyre_per_lap","FR","0.755"
"Interlagos","Ford Mustang LMGT3","2.3","3.022","1.161","56","high","","","120","worst_tyre_per_lap","",""
"Interlagos","Lamborghini Huracan LMGT3 Evo 2","2.63","2.859","0.864","72","high","","","120","worst_tyre_per_lap","",""
"Interlagos","Lexus RC F LMGT3","2.61","2.853","0.942","214","high","","","120","worst_tyre_per_lap","",""
"Interlagos","McLaren 720S LMGT3 Evo","2.16","2.774","0.758","99","high","","","120","worst_tyre_per_lap","",""
"Interlagos","Mercedes-AMG LMGT3","2.4","2.587","0.809","40","medium","","","120","worst_tyre_per_lap","",""
"Interlagos","Porsche 911 LMGT3 R (992)","2.46","2.824","0.854","248","high","","","120","worst_tyre_per_lap","",""
"Monza","Aston Martin Vantage AMR LMGT3 Evo","3.5","4.13","1.572","57","high","","","120","worst_tyre_per_lap","",""
"Monza","BMW M4 LMGT3","3.24","3.997","0.8","107","high","","","120","worst_tyre_per_lap","",""
"Monza","Chevrolet Corvette Z06 LMGT3.R","3.24","4.1","1.15","4","low","","","120","worst_tyre_per_lap","",""
"Monza","Ferrari 296 LMGT3","2.97","4.033","0.879","28","medium","","","120","worst_tyre_per_lap","",""
"Monza","Ford Mustang LMGT3","2.98","3.977","0.8","57","high","","","120","worst_tyre_per_lap","",""
"Monza","Lexus RC F LMGT3","3.47","4.077","0.873","148","high","","","120","worst_tyre_per_lap","",""
"Monza","McLaren 720S LMGT3 Evo","2.92","3.85","0.787","8","medium-low","","","120","worst_tyre_per_lap","",""
"Monza","Mercedes-AMG LMGT3","3.47","4.006","0.751","84","high","","","120","worst_tyre_per_lap","",""
"Monza","Porsche 911 LMGT3 R (992)","3.24","3.993","0.837","36","medium","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","BMW M4 LMGT3","3.26","3.888","0.87","175","high","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Ferrari 296 LMGT3","3.35","3.89","1.18","12","medium-low","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Ford Mustang LMGT3","3.1","3.828","0.811","33","medium","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Lamborghini Huracan LMGT3 Evo 2","3.92","3.84","0.86","5","low","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Lexus RC F LMGT3","3.66","3.925","0.9","20","medium","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","McLaren 720S LMGT3 Evo","3.13","3.919","0.848","37","medium","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Mercedes-AMG LMGT3","3.49","3.948","0.895","25","medium","","","120","worst_tyre_per_lap","",""
"Monza (curvagrande)","Porsche 911 LMGT3 R (992)","3.38","3.9","0.844","33","medium","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Aston Martin Vantage AMR LMGT3 Evo","3.24","3.608","1.568","45","medium","","","120","worst_tyre_per_lap","",""
"Paul Ricard","BMW M4 LMGT3","3.24","3.531","1.554","15","medium-low","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Chevrolet Corvette Z06 LMGT3.R","3.57","3.645","1.532","26","medium","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Ferrari 296 LMGT3","3.24","3.55","2","8","medium-low","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Ford Mustang LMGT3","3.07","3.265","1.482","21","medium","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Lexus RC F LMGT3","3.61","3.531","1.415","15","medium-low","","","120","worst_tyre_per_lap","",""
"Paul Ricard","McLaren 720S LMGT3 Evo","3.2","3.525","1.531","18","medium-low","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Mercedes-AMG LMGT3","3.24","3.517","1.579","28","medium","","","120","worst_tyre_per_lap","",""
"Paul Ricard","Porsche 911 LMGT3 R (992)","3.33","3.5","1.591","41","medium","","","120","worst_tyre_per_lap","",""
"Portimao","Aston Martin Vantage AMR LMGT3 Evo","2.82","3.274","0.865","27","medium","","","120","worst_tyre_per_lap","",""
"Portimao","BMW M4 LMGT3","2.9","3.393","1.103","438","high","","","120","worst_tyre_per_lap","",""
"Portimao","Ferrari 296 LMGT3","2.91","3.374","0.993","168","high","","","120","worst_tyre_per_lap","",""
"Portimao","Ford Mustang LMGT3","2.81","3.445","1.251","307","high","","","120","worst_tyre_per_lap","",""
"Portimao","Lamborghini Huracan LMGT3 Evo 2","3.45","3.442","1.127","67","high","","","120","worst_tyre_per_lap","",""
"Portimao","Lexus RC F LMGT3","3.18","3.427","1.011","184","high","","","120","worst_tyre_per_lap","",""
"Portimao","McLaren 720S LMGT3 Evo","2.86","3.421","0.8","75","high","","","120","worst_tyre_per_lap","",""
"Portimao","Mercedes-AMG LMGT3","3.11","3.394","1.202","80","high","","","120","worst_tyre_per_lap","",""
"Portimao","Porsche 911 LMGT3 R (992)","2.97","3.349","0.947","187","high","","","120","worst_tyre_per_lap","",""
"Sebring","Aston Martin Vantage AMR LMGT3 Evo","3.08","4.225","0.719","18","medium-low","","","120","worst_tyre_per_lap","",""
"Sebring","BMW M4 LMGT3","3.49","4.3","0.789","67","high","","","120","worst_tyre_per_lap","",""
"Sebring","Chevrolet Corvette Z06 LMGT3.R","3.36","4.117","0.788","30","medium","","","120","worst_tyre_per_lap","",""
"Sebring","Ferrari 296 LMGT3","3.21","4.4","0.942","11","High","2:04.502","Sebring 13 laps.xml","120","worst_tyre_per_lap","FL","0.765"
"Sebring","Ford Mustang LMGT3","3.11","4.3","1.033","50","high","","","120","worst_tyre_per_lap","",""
"Sebring","Lamborghini Huracan LMGT3 Evo 2","3.72","4.3","0.811","22","medium","","","120","worst_tyre_per_lap","",""
"Sebring","Lexus RC F LMGT3","3.72","4.3","0.882","91","high","","","120","worst_tyre_per_lap","",""
"Sebring","McLaren 720S LMGT3 Evo","3.17","4.3","0.842","60","high","","","120","worst_tyre_per_lap","",""
"Sebring","Mercedes-AMG LMGT3","3.69","4.218","0.835","42","medium","","","120","worst_tyre_per_lap","",""
"Sebring","Porsche 911 LMGT3 R (992)","3.59","4.319","0.807","104","high","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Aston Martin Vantage AMR LMGT3 Evo","1.64","2.282","0.559","19","medium-low","","","120","worst_tyre_per_lap","",""
"Sebring (school)","BMW M4 LMGT3","1.87","2.246","0.704","118","high","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Chevrolet Corvette Z06 LMGT3.R","1.88","2.309","0.559","26","medium","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Ferrari 296 LMGT3","1.59","2.253","0.684","23","medium","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Ford Mustang LMGT3","1.61","2.295","0.705","110","high","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Lamborghini Huracan LMGT3 Evo 2","1.99","2.326","0.97","33","medium","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Lexus RC F LMGT3","1.92","2.3","0.6","18","medium-low","","","120","worst_tyre_per_lap","",""
"Sebring (school)","McLaren 720S LMGT3 Evo","1.66","2.369","0.754","15","medium-low","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Mercedes-AMG LMGT3","1.98","2.259","0.518","21","medium","","","120","worst_tyre_per_lap","",""
"Sebring (school)","Porsche 911 LMGT3 R (992)","1.91","2.283","0.742","60","high","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Aston Martin Vantage AMR LMGT3 Evo","3.37","3.878","1.028","22","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","BMW M4 LMGT3","3.33","3.742","1.24","130","high","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Chevrolet Corvette Z06 LMGT3.R","3.53","3.882","1.176","21","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Ferrari 296 LMGT3","2.79","3.465","1.409","27","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Ford Mustang LMGT3","3.07","3.924","1.294","19","medium-low","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Lamborghini Huracan LMGT3 Evo 2","4.17","3.879","1.421","23","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Lexus RC F LMGT3","3.32","3.542","2.2","23","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","McLaren 720S LMGT3 Evo","2.94","3.759","1.588","21","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Mercedes-AMG LMGT3","3.72","3.847","0.947","17","medium-low","","","120","worst_tyre_per_lap","",""
"Silverstone (GP)","Porsche 911 LMGT3 R (992)","3.33","3.66","1.251","150","high","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Aston Martin Vantage AMR LMGT3 Evo","1.59","2.021","0.663","23","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","BMW M4 LMGT3","1.83","2.027","0.688","74","high","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Chevrolet Corvette Z06 LMGT3.R","2.03","2.118","0.788","19","medium-low","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Ford Mustang LMGT3","1.6","2.066","0.874","113","high","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Lexus RC F LMGT3","1.92","2","0.791","78","high","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","McLaren 720S LMGT3 Evo","1.57","2","0.723","57","high","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Mercedes-AMG LMGT3","1.96","2.05","0.529","28","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (International)","Porsche 911 LMGT3 R (992)","1.92","2.013","0.723","192","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Aston Martin Vantage AMR LMGT3 Evo","1.44","2","0.4","4","low","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","BMW M4 LMGT3","1.54","1.776","0.535","381","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Chevrolet Corvette Z06 LMGT3.R","1.55","1.794","0.448","37","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Ferrari 296 LMGT3","1.44","1.8","0.495","100","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Ford Mustang LMGT3","1.39","1.75","0.535","100","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Lamborghini Huracan LMGT3 Evo 2","1.74","1.791","0.534","81","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Lexus RC F LMGT3","1.69","1.766","0.41","35","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","McLaren 720S LMGT3 Evo","1.44","1.788","0.519","40","medium","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Mercedes-AMG LMGT3","1.69","1.781","0.505","117","high","","","120","worst_tyre_per_lap","",""
"Silverstone (National)","Porsche 911 LMGT3 R (992)","1.61","1.765","0.418","184","high","","","120","worst_tyre_per_lap","",""
"Spa","Aston Martin Vantage AMR LMGT3 Evo","3.79","4.608","1.996","30","medium","","","120","worst_tyre_per_lap","",""
"Spa","BMW M4 LMGT3","3.99","4.812","1.564","106","high","","","120","worst_tyre_per_lap","",""
"Spa","Chevrolet Corvette Z06 LMGT3.R","4.04","4.724","1.556","29","medium","","","120","worst_tyre_per_lap","",""
"Spa","Ferrari 296 LMGT3","3.54","4.85","1.363","8","Medium","2:22.701","2026_05_18_21_20_24-56P1.xml","120","worst_tyre_per_lap","",""
"Spa","Ford Mustang LMGT3","3.85","4.658","1.385","41","medium","","","120","worst_tyre_per_lap","",""
"Spa","Lamborghini Huracan LMGT3 Evo 2","4.64","4.558","2.271","73","high","","","120","worst_tyre_per_lap","",""
"Spa","Lexus RC F LMGT3","4.45","4.721","1.589","23","medium","","","120","worst_tyre_per_lap","",""
"Spa","McLaren 720S LMGT3 Evo","3.79","4.792","1.731","15","medium-low","","","120","worst_tyre_per_lap","",""
"Spa","Mercedes-AMG LMGT3","4.33","4.883","1.267","56","high","","","120","worst_tyre_per_lap","",""
"Spa","Porsche 911 LMGT3 R (992)","4.14","4.763","1.331","38","medium","","","120","worst_tyre_per_lap","",""
"Bahrain","Ferrari 296 LMGT3","3.03","4.1","1.2","22","High","2:03.865","Bahrain + drive through.xml","120","worst_tyre_per_lap","",""
`;

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseFuelStacheCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCSVLine(lines[0]).map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return {
      track: row.track,
      car: row.car,
      fuelPerLapL: toNumber(row.fuel_per_lap_l),
      nrgPerLapPct: toNumber(row.nrg_per_lap_pct),
      tyreDegPerLapPct: toNumber(row.tyre_deg_per_lap_pct),
      usableLaps: toNumber(row.usable_laps),
      confidence: row.confidence || "unknown",
      avgLapTime: row.avg_lap_time || "",
      sourceFile: row.source_file || "",
      tankLiters: toNumber(row.tank_liters_assumed, 120),
      tyreDegBasis: row.tyre_deg_basis || "worst_tyre_per_lap",
      worstTyre: row.worst_tyre || "",
      avgTyreDegPerLapPct: row.avg_tyre_deg_per_lap_pct
        ? toNumber(row.avg_tyre_deg_per_lap_pct, null)
        : null
    };
  });
}

const FUELSTACHE_DB_ROWS = parseFuelStacheCSV(FUELSTACHE_CSV);

const FUELSTACHE_DB = {
  rows: FUELSTACHE_DB_ROWS,

  getTracks() {
    return [...new Set(this.rows.map(row => row.track))].sort();
  },

  getCars() {
    return [...new Set(this.rows.map(row => row.car))].sort();
  },

  getCarsForTrack(track) {
    return this.rows
      .filter(row => row.track === track)
      .map(row => row.car)
      .sort();
  },

  getEntriesForTrack(track) {
    return this.rows.filter(row => row.track === track);
  },

  getEntry(track, car) {
    return this.rows.find(row => row.track === track && row.car === car) || null;
  },

  getConfidenceWarning(entry) {
    if (!entry) return "No data entry found.";
    if (entry.usableLaps < 5) return "Low confidence: fewer than 5 usable laps.";
    if (entry.usableLaps < 8) return "Low-medium confidence: fewer than 8 usable laps.";
    if (entry.usableLaps < 10) return "Medium confidence: fewer than 10 usable laps.";
    return "High enough sample size.";
  }
};

console.log(`FuelStache DB loaded: ${FUELSTACHE_DB.rows.length} entries`);
