import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
export default function Sell() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [filiere, setFiliere] = useState('');
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !price ||
      !subject ||
      !level ||
      !filiere ||
      !file ||
      !img
    ) {
      alert('Please fill all the fields');
      return;
    }
    setLoading(true);
    const imgPath = `images/${Date.now()}_${img.name}`;
    const { error: imgError } = await supabase.storage
      .from('products')
      .upload(imgPath, img);
    if (imgError) {
      alert(imgError);
      setLoading(false);
      return;
    }
    const filePath = `files/${Date.now()}_${file.name}`;
    const { error: fileError } = await supabase.storage
      .from('products')
      .upload(filePath, file);
    if (fileError) {
      alert(fileError.message);
      setLoading(false);
      return;
    }
    const { data: imgData } = supabase.storage
      .from('products')
      .getPublicUrl(imgPath);
    const imgUrl = imgData.publicUrl;

    const fileUrl = supabase.storage.from('products').getPublicUrl(filePath)
      .data.publicUrl;

    const { error: productError } = await supabase.from('products').insert({
      title,
      description,
      price,
      subject,
      level,
      filiere,
      image_url: imgUrl,
      file_url: fileUrl,
      seller_id: user.id,
    });
    if (productError) {
      alert(productError.message);
      setLoading(false);
      return;
    }
    alert('Product added successfully');
    setTitle('');
    setDescription('');
    setPrice('');
    setSubject('');
    setLevel('');
    setFiliere('');
    setFile(null);
    setImg(null);
    setLoading(false);
  }
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 sm:rounded-2xl mt-8 shadow-md w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Upload a product</h1>
        <p className="text-sm text-gray-400 mb-2">
          Fill in the details below to list your product
        </p>

        {[
          {
            label: 'Title',
            value: title,
            set: setTitle,
            placeholder: 'Product name...',
          },
          {
            label: 'Price (DA)',
            value: price,
            set: setPrice,
            placeholder: '200',
            type: 'number',
            min: 0,
            step: 1,
          },
          {
            label: 'Subject',
            value: subject,
            set: setSubject,
            placeholder: 'e.g. Maths...',
          },
          {
            label: 'Level',
            value: level,
            set: setLevel,
            placeholder: 'e.g. L3',
          },
          {
            label: 'Filiere',
            value: filiere,
            set: setFiliere,
            placeholder: 'e.g. Computer Schience',
          },
        ].map(({ label, value, set, placeholder, type }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 tracking-widest">
              {label.toUpperCase()}
            </label>
            <input
              type={type || 'text'}
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              className="bg-[#F0F0F0] rounded-full px-5 py-2.5 outline-none text-sm text-gray-500"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-500 tracking-widest">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Product description..."
            rows={3}
            className="bg-[#F0F0F0] rounded-2xl px-5 py-3 outline-none text-sm text-gray-500 resize-none"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image upload */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-bold text-gray-500 tracking-widest">
                IMAGE
              </label>
              <label className="flex items-center bg-[#F0F0F0] rounded-full px-5 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-[#e4e4e4] transition-colors truncate">
                <span className="truncate">
                  {img ? img.name : 'Choose image...'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImg(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* File upload */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-bold text-gray-500 tracking-widest">
                FILE
              </label>
              <label className="flex items-center bg-[#F0F0F0] rounded-full px-5 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-[#e4e4e4] transition-colors truncate">
                <span className="truncate">
                  {file ? file.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="whitespace-nowrap mt-2 w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
