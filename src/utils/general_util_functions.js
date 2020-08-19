export function formatDateToYYYYMMDD(javascriptDateObject) {
  return javascriptDateObject.toISOString().split('T')[0];
}

export function getBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}