const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/awsConfig');
const { Upload } = require('@aws-sdk/lib-storage');
const db = require('../db');

const uploadImage = async (req, res) => {
  try {
    const { buffer, mimetype } = req.file;
    const params = {
      Bucket: 'group-project1',
      Key: Date.now().toString() + '-' + req.file.originalname,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    const upload = new Upload({
      client: s3,
      params: params,
    });

    const uploadResponse = await upload.done();

    const imageUrl = `https://${params.Bucket}s3.amazonaws.com/${params.Key}`;
    const [insertResult] = await db.execute('INSERT INTO IMAGES (IMG_LINK) VALUES (?)', [imageUrl]);

    res.json({ imageUrl, insertId: insertResult.insertId, uploadResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi Kesalahan Internal Server' });
  }
};

const getImage = async (req, res) => {
    try {
        const imageId = req.params.id;
        const [result] = await db.execute('SELECT IMG_LINK FROM IMAGES WHERE IMG_ID = ?', [imageId]);

        if (result.length > 0) {
          const imageUrl = result[0].IMG_LINK;
          res.json({ imageUrl });
        } else {
          res.status(404).json({ error: 'Gambar tidak ditemukan' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi Kesalahan Internal Server' });
}};

const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.id;
    
        // Query database untuk mendapatkan link image dengan ID tertentu
        const [result] = await db.execute('SELECT IMG_LINK FROM IMAGES WHERE IMG_ID = ?', [imageId]);
    
        // Jika data ditemukan, lakukan penghapusan pada S3 dan database
        if (result.length > 0) {
          const imageUrl = result[0].IMG_LINK;
    
          // Hapus file dari S3
          const key = imageUrl.split('/').pop();
          const deleteParams = {
            Bucket: 'group-project1',
            Key: key,
          };
          await s3.send(new DeleteObjectCommand(deleteParams));
    
          // Hapus data dari database
          await db.execute('DELETE FROM IMAGES WHERE IMG_ID = ?', [imageId]);
    
          res.json({ success: true, message: 'Gambar berhasil dihapus' });
        } else {
          // Jika data tidak ditemukan, kirim respons 404 Not Found
          res.status(404).json({ error: 'Gambar tidak ditemukan' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi Kesalahan Internal Server' });
      }
    }
    

module.exports = { uploadImage, getImage, deleteImage };
