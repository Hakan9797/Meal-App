import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

// "meals.db" dosyasına SQL işlemleri için bağlantı oluşturur
const db = sql("meals.db");

// Tüm yemekleri almak için bir fonksiyon
export async function getMeals() {
  // İşlemi 2 saniye geciktirmek için bekletir
  await new Promise((resolve) => setTimeout(resolve, 1000));

  //   throw new Error("Loading meals failed")

  // Yemekler tablosundan tüm kayıtları seçer ve döndürür
  return db.prepare("SELECT * FROM meals").all();
}

// Belirli bir yemek almak için bir fonksiyon
export function getMeal(slug) {
  // Belirtilen slug ile eşleşen yemeği seçer ve döndürür
  return db.prepare("SELECT * FROM meals WHERE slug= ?").get(slug);
}

// Yeni bir yemek kaydetmek için bir fonksiyon
export async function saveMeal(meal) {
  // Yemeğin başlığından slug oluşturur ve küçük harfe çevirir
  meal.slug = slugify(meal.title, { lower: true });
  // Yemeğin talimatlarını XSS koruması için temizler
  meal.instructions = xss(meal.instructions);
  // Resim dosyasının uzantısını belirler
  const extension = meal.image.name.split(".").pop();
  // Dosya adını slug ve uzantı kullanarak oluşturur
  const fileName = `${meal.slug}.${extension}`;

  // Resmi kaydetmek için bir yazma akışı oluşturur
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  // Resmi bir arabellek olarak okur
  const bufferedImage = await meal.image.arrayBuffer();

  // Arabellekten gelen verileri yazma akışına yazar
  stream.write(Buffer.from(bufferedImage), (error) => {
    // Yazma sırasında bir hata oluşursa hata fırlatır
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  // Resim yolunu yemeğin image özelliğine atar
  meal.image = `/images/${fileName}`;

  // Yemeği veritabanına ekler
  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES( 
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
    `
  ).run(meal);
}
