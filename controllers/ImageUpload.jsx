import uid from "./uid";

export const handleImageUpload = (e, newElement, activeSlide) => {
    const file = e.target.files[0];
    if (!file) return;

    // read file data
    const reader = new FileReader();
    reader.onload = () => {
        const newImgElement = {
            id: uid(),
            slideId: activeSlide.id,
            type: 'image',
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            borderRadius: 0,
            selected: true,
            image: reader.result,  // base64 data url
        };

        newElement(newImgElement);
    }

    reader.readAsDataURL(file);  // convert img to base64
}