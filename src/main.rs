#![feature(plugin)]
#![plugin(rocket_codegen)]

static mut curr_id: u64 = 0;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate serde;

extern crate rocket_contrib;
use rocket_contrib::{Json, Value};

extern crate rocket;
use rocket::response::NamedFile;
use std::path::*;

use std::fs::File;
use std::io::prelude::*;

#[get("/public/<file..>")]
fn serve_public_file(file: PathBuf) -> Option<NamedFile> {
	NamedFile::open(Path::new("public/").join(file)).ok()
}

#[get("/")]
fn index() -> NamedFile {
    NamedFile::open("public/views/main.html").expect("Failed to load template: main.html")
}

#[get("/<id>")] 
fn view_paste(id: String) -> NamedFile {
	index()
}

#[get("/api/get/<id>")]
fn api_get(id: u64) -> Option<NamedFile> {
	let mut path = PathBuf::new();
	path.push("public/pastes/");
	path.push(id.to_string());
	path.set_extension("txt");
	
	{
		let _path = path.to_string_lossy();
		println!("{}", _path);
	}
	NamedFile::open(path).ok()
}

#[derive(Serialize, Deserialize)]
struct api_save_payload {
	payload: String
}

#[derive(Serialize, Deserialize)]
struct Paste {
	id: u64,
	payload: String
}

#[post("/api/save", data="<input>", format="application/json")]
fn api_save(input: Json<api_save_payload>) -> Json<Paste> {
	unsafe {
		curr_id += 1;
		
		let mut file = File::create(format!("public/pastes/{}.txt", curr_id )).expect("Saving file.");
		file.write_all(&input.payload.clone().into_bytes()).expect("Saving file.");
		
		Json(Paste { 
			id: curr_id, 
			payload: input.payload.clone()
		})
	}
}

fn main() {
	let jupiter = { 
		rocket::ignite()
		.mount("/", routes![index])
		.mount("/", routes![serve_public_file])
		.mount("/", routes![api_save])
		.mount("/", routes![view_paste])
		.mount("/", routes![api_get])
	};
	
	jupiter.launch();
}