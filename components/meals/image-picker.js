"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import classes from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImageChange(event) {
    // Dosya girdisindeki ilk dosyayı seçer
    const file = event.target.files[0];

    // Eğer dosya yoksa, `setPickedImage` fonksiyonunu `null` ile çağırır ve fonksiyonu sonlandırır
    if (!file) {
      setPickedImage(null);
      return;
    }

    // Yeni bir `FileReader` nesnesi oluşturur
    const fileReader = new FileReader();

    // `fileReader` nesnesinin `onload` olayına bir fonksiyon ekler
    // Bu fonksiyon, dosya yüklendiğinde çalışacak
    fileReader.onload = () => {
      // Yüklenen dosyanın verisini `setPickedImage` fonksiyonunu kullanarak state'e kaydeder
      setPickedImage(fileReader.result);
    };

    // Dosyayı Data URL olarak okur (base64 formatında)
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
