export const checkImage = (file: File) => {
    const types = ['image/png', 'image/jpeg']
    let err = ''
    if (!file) return err = 'File does not exist'
    if (file.size > 1024 * 1024) return err = 'Image size must be less than 1mb'
    if (!types.includes(file.type)) return err = 'Image must be of type png / jpeg'
    return err  
}

export const imageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'mw7hotcb')
    formData.append('cloud_name', 'dvp3bjtom')

    const res = await fetch('https://api.cloudinary.com/v1_1/dvp3bjtom/upload', {
        method: 'POST',
        body: formData
    })

    const data = await res.json()
    return { public_id: data.public_id, url: data.secure_url }
}