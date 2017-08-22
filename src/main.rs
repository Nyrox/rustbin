#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
use rocket::response::NamedFile;

use std::path::*;

#[get("/public/<file..>")]
fn serve_public_file(file: PathBuf) -> Option<NamedFile> {
	NamedFile::open(Path::new("public/").join(file)).ok()
}

#[get("/")]
fn index() -> NamedFile {
    NamedFile::open("public/views/main.html").expect("Failed to load template: main.html")
}

fn main() {
	let jupiter = { 
		rocket::ignite()
		.mount("/", routes![index])
		.mount("/", routes![serve_public_file])
	};
	
	jupiter.launch();
}