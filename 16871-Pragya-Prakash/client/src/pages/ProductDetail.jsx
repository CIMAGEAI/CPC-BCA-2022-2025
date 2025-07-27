import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Clock,
  Package,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch product details
  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    },
    {
      retry: 1,
      onError: (error) => {
        console.error('Error fetching product:', error);
      }
    }
  );

  // Fetch related products
  const { data: relatedProducts } = useQuery(
    ['relatedProducts', id, product?.category?._id],
    async () => {
      if (!product?.category?._id) return [];
      const response = await api.get(`/products?category=${product.category._id}&limit=4`);
      return response.data.data.filter(p => p._id !== id);
    },
    { enabled: !!product?.category?._id }
  );

  // Fetch reviews
  const { data: reviews } = useQuery(
    ['reviews', id],
    async () => {
      const response = await api.get(`/reviews?product=${id}`);
      return response.data.data;
    }
  );

  // Add review mutation
  const addReviewMutation = useMutation(
    async (reviewData) => {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', id]);
        queryClient.invalidateQueries(['product', id]);
        setShowReviewForm(false);
        setReviewForm({ rating: 5, comment: '' });
        toast.success('Review submitted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      }
    }
  );

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      variant: selectedVariant
    };
    addToCart(productToAdd, quantity);
    toast.success('Product added to cart!');
  };

  const handleBuyNow = () => {
    const productToAdd = {
      ...product,
      variant: selectedVariant
    };
    addToCart(productToAdd, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    addReviewMutation.mutate({
      product: id,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
  };

  const images = product?.images || [product?.mainImage].filter(Boolean) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error.response?.status === 404 ? 'Product not found' : 'Error loading product'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error.response?.status === 404 
              ? 'The product you are looking for does not exist or has been removed.'
              : 'There was an error loading the product. Please try again.'
            }
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-orange-600 transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/products')} className="hover:text-orange-600 transition-colors">
                Products
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate(`/products?category=${product.category?._id}`)} className="hover:text-orange-600 transition-colors">
                {product.category?.name}
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImage]?.url || 'https://via.placeholder.com/600x600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-orange-600 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image?.url || 'https://via.placeholder.com/80x80'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {/* Category Badge */}
              {product.category && (
                <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {product.category.name}
                </div>
              )}

              <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-gray-600 mb-4 text-lg">{product.shortDescription}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings?.average || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.ratings?.average?.toFixed(1) || '0'} ({product.ratings?.count || 0} reviews)
                </span>
                {product.ratings?.count > 0 && (
                  <span className="text-green-600 text-sm font-medium">
                    ★ Verified Purchase
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-orange-600">
                  ₹{selectedVariant?.price || product.price}
                </span>
                {product.comparePrice && product.comparePrice > (selectedVariant?.price || product.price) && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.comparePrice}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((product.comparePrice - (selectedVariant?.price || product.price)) / product.comparePrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Option</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedVariant?._id === variant._id
                          ? 'border-orange-600 bg-orange-50 text-orange-600'
                          : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center text-lg font-medium px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 text-white py-4 px-6 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 text-white py-4 px-6 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Zap className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 border-2 rounded-lg transition-all duration-200 ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Truck className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Free Shipping</p>
                  <p className="text-sm text-green-600">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Secure Payment</p>
                  <p className="text-sm text-blue-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Easy Returns</p>
                  <p className="text-sm text-purple-600">7-day return policy</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  Weight: {product.weight ? `${product.weight.value}${product.weight.unit}` : '500g'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  Shelf Life: {product.shelfLife ? `${product.shelfLife.value} ${product.shelfLife.unit}` : '12 months'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Details */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
                  <p className="text-gray-600">{Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}</p>
                </div>
              )}
              
              {product.nutritionalInfo && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Information</h3>
                  <div className="text-gray-600">
                    {typeof product.nutritionalInfo === 'object' ? (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{product.nutritionalInfo}</p>
                    )}
                  </div>
                </div>
              )}

              {product.howToUse && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h3>
                  <p className="text-gray-600">{product.howToUse}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                <p className="text-gray-600 mt-1">See what our customers are saying</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(`/products/${id}/reviews`)}
                  className="flex items-center space-x-2 px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>View All Reviews</span>
                </button>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50"
              >
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="text-2xl transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= reviewForm.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={addReviewMutation.isLoading}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      {addReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews?.length > 0 ? (
                <>
                                    {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {review.user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate(`/products/${id}/reviews`)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View all {reviews.length} reviews →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400">Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">You might also like</h2>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <span>View All Products</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct._id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                  onClick={() => navigate(`/products/${relatedProduct._id}`)}
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.mainImage?.url || 'https://via.placeholder.com/300x200'}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    {relatedProduct.isOnSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600 text-lg">₹{relatedProduct.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500">
                          {relatedProduct.ratings?.average?.toFixed(1) || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 