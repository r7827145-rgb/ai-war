-- =============================================
-- Seed: Kerala Places
-- =============================================
INSERT INTO public.places (id, name_en, name_ml, district, lat, lng) VALUES
('p_tvm','Thiruvananthapuram','തിരുവനന്തപുരം','Thiruvananthapuram',8.5241,76.9366),
('p_klm','Kollam','കൊല്ലം','Kollam',8.8932,76.6141),
('p_ptm','Pathanamthitta','പത്തനംതിട്ട','Pathanamthitta',9.2648,76.787),
('p_alp','Alappuzha','ആലപ്പുഴ','Alappuzha',9.4981,76.3388),
('p_ktm','Kottayam','കോട്ടയം','Kottayam',9.5916,76.5222),
('p_idk','Idukki','ഇടുക്കി','Idukki',9.85,76.97),
('p_mun','Munnar','മൂന്നാർ','Idukki',10.0889,77.0595),
('p_ekm','Ernakulam','എറണാകുളം','Ernakulam',9.9816,76.2999),
('p_alv','Aluva','ആലുവ','Ernakulam',10.1081,76.3517),
('p_tcr','Thrissur','തൃശൂർ','Thrissur',10.5276,76.2144),
('p_pkd','Palakkad','പാലക്കാട്','Palakkad',10.7867,76.6548),
('p_mlp','Malappuram','മലപ്പുറം','Malappuram',11.0735,76.0741),
('p_ckd','Kozhikode','കോഴിക്കോട്','Kozhikode',11.2588,75.7804),
('p_wyd','Wayanad (Kalpetta)','വയനാട് (കൽപ്പറ്റ)','Wayanad',11.6094,76.083),
('p_knr','Kannur','കണ്ണൂർ','Kannur',11.8745,75.3704),
('p_ksd','Kasaragod','കാസർഗോഡ്','Kasaragod',12.4996,74.9869),
('p_gur','Guruvayur','ഗുരുവായൂർ','Thrissur',10.5945,76.0419),
('p_sbr','Sabarimala','ശബരിമല','Pathanamthitta',9.4365,77.0817),
('p_kmy','Kumily / Thekkady','കുമളി / തേക്കടി','Idukki',9.6,77.165),
('p_var','Varkala','വർക്കല','Thiruvananthapuram',8.7379,76.7163),
('p_fkc','Fort Kochi','ഫോർട്ട് കൊച്ചി','Ernakulam',9.9647,76.2424),
('p_vyt','Vyttila','വൈറ്റില','Ernakulam',9.9678,76.3186),
('p_kkn','Kakkanad','കാക്കനാട്','Ernakulam',10.0159,76.34),
('p_per','Perinthalmanna','പെരിന്തൽമണ്ണ','Malappuram',10.9745,76.2253),
('p_ttv','Thalassery','തലശ്ശേരി','Kannur',11.7484,75.4929),
('p_klp','Kalpetta','കൽപ്പറ്റ','Wayanad',11.6094,76.083)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Seed: Buses
-- =============================================
INSERT INTO public.buses (id, number, operator_en, operator_ml, type, route_name_en, route_name_ml, from_en, from_ml, to_en, to_ml, status, eta_minutes, seats_available, total_seats, fare, frequency_mins, departure, arrival, duration_mins, path, stop_list, progress, speed) VALUES
('b1','KL-15-A-2210','KSRTC Super Fast','കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്','Super Fast','Thiruvananthapuram → Ernakulam','തിരുവനന്തപുരം → എറണാകുളം','Thiruvananthapuram','തിരുവനന്തപുരം','Ernakulam','എറണാകുളം','on-time',8,22,48,245,30,'06:00','11:30',330,'[[8.5241,76.9366],[8.7379,76.7163],[8.8932,76.6141],[9.4981,76.3388],[9.9816,76.2999]]','[{"name":{"en":"Thiruvananthapuram","ml":"തിരുവനന്തപുരം"},"progress":0},{"name":{"en":"Varkala","ml":"വർക്കല"},"progress":0.18},{"name":{"en":"Kollam","ml":"കൊല്ലം"},"progress":0.4},{"name":{"en":"Alappuzha","ml":"ആലപ്പുഴ"},"progress":0.72},{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":1}]',0.32,0.0015),
('b2','KL-07-BR-1180','KURTC Volvo','കെ.യു.ആർ.ടി.സി വോൾവോ','Volvo AC','Ernakulam → Bangalore (via Salem)','എറണാകുളം → ബാംഗ്ലൂർ','Ernakulam','എറണാകുളം','Palakkad','പാലക്കാട്','delayed',14,4,42,380,60,'21:00','05:30',510,'[[9.9816,76.2999],[10.1081,76.3517],[10.5276,76.2144],[10.7867,76.6548]]','[{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":0},{"name":{"en":"Aluva","ml":"ആലുവ"},"progress":0.12},{"name":{"en":"Thrissur","ml":"തൃശൂർ"},"progress":0.55},{"name":{"en":"Palakkad","ml":"പാലക്കാട്"},"progress":1}]',0.55,0.0018),
('b3','KL-13-CK-9051','KSRTC Fast Passenger','കെ.എസ്.ആർ.ടി.സി ഫാസ്റ്റ് പാസഞ്ചർ','Fast Passenger','Kozhikode → Wayanad','കോഴിക്കോട് → വയനാട്','Kozhikode','കോഴിക്കോട്','Wayanad (Kalpetta)','വയനാട് (കൽപ്പറ്റ)','full',3,0,50,120,20,'07:30','10:15',165,'[[11.2588,75.7804],[11.6094,76.083]]','[{"name":{"en":"Kozhikode","ml":"കോഴിക്കോട്"},"progress":0},{"name":{"en":"Kalpetta","ml":"കൽപ്പറ്റ"},"progress":1}]',0.62,0.0022),
('b4','KL-07-DT-4422','KSRTC Ordinary','കെ.എസ്.ആർ.ടി.സി ഓർഡിനറി','Ordinary','Kakkanad → Fort Kochi','കാക്കനാട് → ഫോർട്ട് കൊച്ചി','Kakkanad','കാക്കനാട്','Fort Kochi','ഫോർട്ട് കൊച്ചി','on-time',6,25,42,30,15,'Every 15 min','—',55,'[[10.0159,76.34],[9.9678,76.3186],[9.9816,76.2999],[9.9647,76.2424]]','[{"name":{"en":"Kakkanad","ml":"കാക്കനാട്"},"progress":0},{"name":{"en":"Vyttila","ml":"വൈറ്റില"},"progress":0.35},{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":0.7},{"name":{"en":"Fort Kochi","ml":"ഫോർട്ട് കൊച്ചി"},"progress":1}]',0.45,0.0035),
('b5','KL-09-MN-7711','KSRTC Super Fast','കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്','Super Fast','Ernakulam → Munnar','എറണാകുളം → മൂന്നാർ','Ernakulam','എറണാകുളം','Munnar','മൂന്നാർ','on-time',11,18,48,175,90,'08:30','13:00',270,'[[9.9816,76.2999],[10.1081,76.3517],[9.85,76.97],[10.0889,77.0595]]','[{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":0},{"name":{"en":"Aluva","ml":"ആലുവ"},"progress":0.1},{"name":{"en":"Idukki","ml":"ഇടുക്കി"},"progress":0.65},{"name":{"en":"Munnar","ml":"മൂന്നാർ"},"progress":1}]',0.28,0.0012),
('b6','KL-13-KK-3344','KSRTC Long Distance','കെ.എസ്.ആർ.ടി.സി','Super Fast','Kannur → Thiruvananthapuram','കണ്ണൂർ → തിരുവനന്തപുരം','Kannur','കണ്ണൂർ','Thiruvananthapuram','തിരുവനന്തപുരം','on-time',26,12,48,720,120,'17:00','07:30',870,'[[11.8745,75.3704],[11.7484,75.4929],[11.2588,75.7804],[11.0735,76.0741],[10.5276,76.2144],[9.9816,76.2999],[9.4981,76.3388],[8.8932,76.6141],[8.5241,76.9366]]','[{"name":{"en":"Kannur","ml":"കണ്ണൂർ"},"progress":0},{"name":{"en":"Kozhikode","ml":"കോഴിക്കോട്"},"progress":0.18},{"name":{"en":"Thrissur","ml":"തൃശൂർ"},"progress":0.42},{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":0.55},{"name":{"en":"Kollam","ml":"കൊല്ലം"},"progress":0.85},{"name":{"en":"Thiruvananthapuram","ml":"തിരുവനന്തപുരം"},"progress":1}]',0.5,0.001),
('b7','KL-04-SF-9090','KSRTC Sabari','കെ.എസ്.ആർ.ടി.സി ശബരി','Fast Passenger','Pathanamthitta → Sabarimala','പത്തനംതിട്ട → ശബരിമല','Pathanamthitta','പത്തനംതിട്ട','Sabarimala','ശബരിമല','delayed',18,8,42,95,45,'Every 45 min','—',120,'[[9.2648,76.787],[9.4365,77.0817]]','[{"name":{"en":"Pathanamthitta","ml":"പത്തനംതിട്ട"},"progress":0},{"name":{"en":"Sabarimala","ml":"ശബരിമല"},"progress":1}]',0.38,0.0014),
('b8','KL-22-GW-1212','KSRTC','കെ.എസ്.ആർ.ടി.സി','Fast Passenger','Thrissur → Guruvayur','തൃശൂർ → ഗുരുവായൂർ','Thrissur','തൃശൂർ','Guruvayur','ഗുരുവായൂർ','on-time',5,30,48,45,10,'Every 10 min','—',40,'[[10.5276,76.2144],[10.5945,76.0419]]','[{"name":{"en":"Thrissur","ml":"തൃശൂർ"},"progress":0},{"name":{"en":"Guruvayur","ml":"ഗുരുവായൂർ"},"progress":1}]',0.6,0.004),
('b9','KL-60-KS-1001','KSRTC','കെ.എസ്.ആർ.ടി.സി','Super Fast','Kasaragod → Kozhikode','കാസർഗോഡ് → കോഴിക്കോട്','Kasaragod','കാസർഗോഡ്','Kozhikode','കോഴിക്കോട്','on-time',9,20,48,260,60,'09:00','13:30',270,'[[12.4996,74.9869],[11.8745,75.3704],[11.7484,75.4929],[11.2588,75.7804]]','[{"name":{"en":"Kasaragod","ml":"കാസർഗോഡ്"},"progress":0},{"name":{"en":"Kannur","ml":"കണ്ണൂർ"},"progress":0.45},{"name":{"en":"Kozhikode","ml":"കോഴിക്കോട്"},"progress":1}]',0.4,0.0016),
('b10','KL-05-KT-7788','KSRTC','കെ.എസ്.ആർ.ടി.സി','Fast Passenger','Kottayam → Kumily (Thekkady)','കോട്ടയം → കുമളി','Kottayam','കോട്ടയം','Kumily / Thekkady','കുമളി / തേക്കടി','on-time',12,16,42,135,60,'Every 1 hr','—',180,'[[9.5916,76.5222],[9.85,76.97],[9.6,77.165]]','[{"name":{"en":"Kottayam","ml":"കോട്ടയം"},"progress":0},{"name":{"en":"Idukki","ml":"ഇടുക്കി"},"progress":0.55},{"name":{"en":"Kumily / Thekkady","ml":"കുമളി / തേക്കടി"},"progress":1}]',0.22,0.0013),
('b11','KL-10-PK-5050','KSRTC','കെ.എസ്.ആർ.ടി.സി','Ordinary','Palakkad → Perinthalmanna','പാലക്കാട് → പെരിന്തൽമണ്ണ','Palakkad','പാലക്കാട്','Perinthalmanna','പെരിന്തൽമണ്ണ','on-time',7,28,42,75,20,'Every 20 min','—',90,'[[10.7867,76.6548],[10.9745,76.2253]]','[{"name":{"en":"Palakkad","ml":"പാലക്കാട്"},"progress":0},{"name":{"en":"Perinthalmanna","ml":"പെരിന്തൽമണ്ണ"},"progress":1}]',0.5,0.0025),
('b12','KL-07-LF-3030','Kochi Metro Feeder','കൊച്ചി മെട്രോ','AC Low Floor','Aluva → Tripunithura (Metro Feeder)','ആലുവ → തൃപ്പൂണിത്തുറ','Aluva','ആലുവ','Vyttila','വൈറ്റില','on-time',4,32,50,25,8,'Every 8 min','—',60,'[[10.1081,76.3517],[9.9816,76.2999],[9.9678,76.3186]]','[{"name":{"en":"Aluva","ml":"ആലുവ"},"progress":0},{"name":{"en":"Ernakulam","ml":"എറണാകുളം"},"progress":0.55},{"name":{"en":"Vyttila","ml":"വൈറ്റില"},"progress":1}]',0.7,0.005)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Seed: Stops
-- =============================================
INSERT INTO public.stops (id, name_en, name_ml, district, distance_meters, lat, lng, routes) VALUES
('s1','MG Road','എം.ജി റോഡ്','Ernakulam',220,9.981,76.282,'{"KL-15-A-2210","KL-07-DT-4422"}'),
('s2','Marine Drive','മറൈൻ ഡ്രൈവ്','Ernakulam',480,9.9847,76.2772,'{"KL-07-BR-1180"}'),
('s3','Ernakulam South','എറണാകുളം സൗത്ത്','Ernakulam',760,9.9684,76.292,'{"KL-13-CK-9051","KL-15-A-2210"}'),
('s4','Vyttila Hub','വൈറ്റില ഹബ്','Ernakulam',950,9.9678,76.3186,'{"KL-07-BR-1180","KL-07-DT-4422"}')
ON CONFLICT (id) DO NOTHING;
