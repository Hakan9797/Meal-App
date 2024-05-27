"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  // Metin değeri boş veya yalnızca boşluk içeriyorsa true döner, aksi halde false
  return !text || text.trim() === "";
}

// Asenkron `shareMeal` fonksiyonu, yemek paylaşımı işlemlerini gerçekleştirir
export async function shareMeal(prevState, formData) {
  // formData'dan çeşitli alanları okuyarak bir `meal` nesnesi oluşturur
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  // Giriş verilerini doğrular; herhangi bir alan geçersizse, geçersiz giriş mesajı döner
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // Geçersiz giriş durumunda döndürülen mesaj
    return {
      message: "Invalid input.",
    };
  }

  // Geçerli girişler durumunda, yemeği kaydetmek için `saveMeal` fonksiyonunu çağırır
  await saveMeal(meal);
  
  revalidatePath("/meals");
  // "/meals" sayfasına yönlendirme yapar
  redirect("/meals");
}
