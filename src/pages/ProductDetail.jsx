import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [hasPurchased,setHasPurchased]=useState(false)
  const [rating,setRating]=useState(5)
  const[comment,setComment]=useState('')
  const[hasReviewed,setHasReviewed]=useState(false)
  const[reviews,setReviews]=useState([])
  useEffect(()=>{
  async function fetchReviews(){
    const {data}=await supabase.from('reviews').select('*').eq('product_id',id)
    setReviews(data)
  }
  fetchReviews()
},[id])
  
  useEffect(()=>{
    async function checkPurchase(){
      const {data:userData}=await supabase.auth.getUser()
      const userId = userData.user.id
      const {data,error}=await supabase.from(`purchases`).select('*').eq('buyer_id',userId).eq('product_id',id).single()
      if(data && !error) setHasPurchased(true)
    }
  //nzido ,error ... wnzido !error back fl page reload useEffect dir khdmtha 
  checkPurchase()
  },[id])
    useEffect(()=>{
      async function checkReview(){
        const {data:userData}=await supabase.auth.getUser()
        const userId=userData.user.id
        const {data, error}=await supabase.from('reviews').select('*').eq('buyer_id',userId).eq('product_id',id).single()
        if(data && !error)setHasReviewed(true)
      }checkReview()
    },[id])
  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      setProduct(data);
    }
    fetchProduct();
  }, []);
  if (!product)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading...
      </div>
    );

  async function handleBuy() {
    const { data } = await supabase.auth.getUser();
    const userId = data.user.id;

    const { error } = await supabase.from('purchases').insert({
      buyer_id: userId,
      product_id: product.id,
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Purchase successful!');
      const link = document.createElement('a');
      link.href = product.file_url;
      link.download = product.title;
      link.click();
    }
  }
  async function handleReview(){
    const {data}=await supabase.auth.getUser()
    const userId=data.user.id
    
    const {error}=await supabase.from('reviews').insert({
      product_id:product.id,
      buyer_id:userId,
      rating,
      comment
    })
    if(error){
      alert(error.message)
    }else{
      alert('Comment submited!')
      setComment('')
setRating(5)
setHasReviewed(true)
    }
  }
  return (
    <div className="flex justify-center px-4 sm:px-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col  gap-8 w-full max-w-4xl"
      >
        <div className='flex flex-col lg:flex-row gap-8'>
        <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
          <img
            className="w-full max-h-80 object-contain rounded-xl"
            src={product.image_url}
            alt={product.title}
          />
        </div>
        <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-md p-6 sm:p-8 flex-1">
          <h2 className="font-bold text-2xl text-gray-800">{product.title}</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              {product.subject}
            </span>
            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              {product.level}
            </span>
            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              {product.filiere}
            </span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 tracking-widest">
              DESCRIPTION
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          <hr className="border-gray-100" />
          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="font-bold text-2xl bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent whitespace-nowrap">
              {Number(product.price).toFixed(2)} DA
            </p>
            <button
              onClick={handleBuy}
              className="cursor-pointer text-white font-bold rounded-full py-2.5 px-8 bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200 shadow-md whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>
        </div>
        </div>
        {hasPurchased && !hasReviewed && (
          <div className='mt-2 bg-white rounded-2xl shadow-md p-8'>
            <h3 className='font-bold text-lg text-gray-700'>Leave a Review</h3>
              <div className='flex gap-1 my-4'>
                {[1,2,3,4,5].map(star=>(
                  <FaStar
                  key={star}
                  size={24}
                  className='cursor-pointer transition-colors duration-150'
                  color={star<=rating ? '#FF4760' : '#d6d6d6'}
                  onClick={()=> setRating(star)}/>
                ))}
              </div>

            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder='Write your comment ...' rows={3} className='bg-[#F0F0F0] rounded-2xl px-5 py-3 outline-none text-sm text-gray-500 resize-none w-full' />
              <button onClick={handleReview} className='w-full py-3 rounded-full my-4 text-white font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200' >Submit Review</button>
          </div>
        )}
        {hasPurchased && hasReviewed &&(
          <div className='bg-white rounded-2xl shadow-md p-8 text-center text-gray-500'>You already reviewed this product ✓</div>
        )}
        {reviews.length>0 && (
          <div className='w-full bg-white rounded-2xl shadow-md p-8 flex flex-col gap-4'>
            <h3 className='font-bold text-lg text-gray-700'>Reviews</h3>
            {reviews.map(review=>(
              <div key={review.id} className='flex flex-col gap-2 border-b border-gray-100 pb-4'>
                <div className='flex gap-1'>{[1,2,3,4,5].map(star=>(
                  <FaStar key={star}size={16} color={star <= review.rating ? '#FF4760' : '#d6d6d6'} />
                ))}
                </div>
                <p className='text-sm text-gray-600'>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
