import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMovieCast, useGetMovieCrew } from "../../hooks/movie-role.hooks";
import { useGetCriticReviews, useGetMovieReviews, useCreateMovieReview } from "../../hooks/review.hooks";

const MoviesPage = () => {

  const movie = useSelector((state) => state.movie);
  const navigate = useNavigate();
  const { id } = useParams();
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: cast, isLoading: castLoading } = useGetMovieCast(id);
  const { data: crew, isLoading: crewLoading } = useGetMovieCrew(id);
  const { data: criticReviews, isLoading: criticLoading } = useGetCriticReviews(id);
  const { data: userReviews, isLoading: userReviewsLoading } = useGetMovieReviews(id);
  const createReview = useCreateMovieReview();

  useEffect(() => {
    if (movie._id === null) {
      navigate("/explore");
    }
  }, []);

  const handleNavigation = () => {
    navigate(`/Nagpur/movies/${movie._id}/bookShow`)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      await createReview.mutateAsync({
        movieId: id,
        rating: userRating,
        review: userReview,
      });
      setUserRating(0);
      setUserReview("");
      setShowReviewForm(false);
      alert("Review submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const StarRating = ({ rating, onRate, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate && onRate(star)}
            className={`text-2xl ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
            disabled={readonly}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="p-10">
        <div className="hero bg-base-200 min-h-400 rounded-lg mb-10">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src={movie.imageURL}
              className="rounded-lg shadow-2xl size-2/5"
              />
            <div>
              <h1 className="text-5xl font-bold">{movie.title}</h1>
              
              {/* Movie Metadata */}
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                {movie.adultRating && (
                  <div className="badge badge-neutral badge-lg font-semibold">{movie.adultRating}</div>
                )}
                {movie.durationInMinutes && (
                  <div className="badge badge-outline badge-lg">{movie.durationInMinutes} min</div>
                )}
                {movie.language && (
                  <div className="badge badge-outline badge-lg">{movie.language}</div>
                )}
              </div>

              {/* Genres */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {movie.genre.map((g, index) => (
                    <span key={index} className="badge badge-primary badge-md">{g}</span>
                  ))}
                </div>
              )}

              {/* Categories */}
              {movie.categories && movie.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.categories.map((category, index) => (
                    <span key={index} className="badge badge-secondary badge-md">{category}</span>
                  ))}
                </div>
              )}

              <p className="py-6">
                {movie.description}
              </p>
              <button className="btn btn-primary rounded-full" onClick={handleNavigation}>
                Veiw Shows
              </button>
            </div>
          </div>
        </div>
        <div className="divider divider-primary"></div>
        
        {/* Cast Section */}
        <div className="mb-10">
          <div>
            <h1 className="text-2xl mb-5 font-bold">Cast</h1>
          </div>
          {castLoading ? (
            <div className="flex gap-5">
              <div className="skeleton h-32 w-32 rounded-full"></div>
              <div className="skeleton h-32 w-32 rounded-full"></div>
              <div className="skeleton h-32 w-32 rounded-full"></div>
            </div>
          ) : cast && cast.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4">
              {cast.map((member) => (
                <div 
                  key={member._id} 
                  className="flex flex-col items-center min-w-fit cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/person/${member.personId._id}`)}
                >
                  <img
                    className="mask mask-circle h-32 w-32 object-cover"
                    src={member.personId.imageURL || "https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"}
                    alt={member.personId.name}
                  />
                  <p className="mt-2 font-semibold text-center max-w-32">{member.personId.name}</p>
                  {member.characterName && (
                    <p className="text-sm text-gray-500 text-center max-w-32">as {member.characterName}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No cast information available</p>
          )}
        </div>

        {/* Crew Section */}
        <div>
          <div>
            <h1 className="text-2xl mb-5 font-bold">Crew</h1>
          </div>
          {crewLoading ? (
            <div className="flex gap-5">
              <div className="skeleton h-32 w-32 rounded-full"></div>
              <div className="skeleton h-32 w-32 rounded-full"></div>
            </div>
          ) : crew && crew.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4">
              {crew.map((member) => (
                <div 
                  key={member._id} 
                  className="flex flex-col items-center min-w-fit cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/person/${member.personId._id}`)}
                >
                  <img
                    className="mask mask-circle h-32 w-32 object-cover"
                    src={member.personId.imageURL || "https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"}
                    alt={member.personId.name}
                  />
                  <p className="mt-2 font-semibold text-center max-w-32">{member.personId.name}</p>
                  <p className="text-sm text-gray-500 text-center max-w-32 capitalize">{member.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No crew information available</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="divider divider-primary"></div>
        
        {/* Critic Reviews */}
        <div className="mb-10">
          <h1 className="text-3xl mb-5 font-bold">Critics Reviews</h1>
          {criticLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          ) : criticReviews && criticReviews.length > 0 ? (
            <div className="space-y-4">
              {criticReviews.map((review) => (
                <div key={review._id} className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-xl">{review.criticName}</h3>
                        <p className="text-sm text-gray-500">{review.publication}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <StarRating rating={review.rating} readonly={true} />
                        <p className="text-sm text-gray-500 mt-1">{formatDate(review.reviewDate)}</p>
                      </div>
                    </div>
                    <p className="mt-4">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No critic reviews yet</p>
          )}
        </div>

        {/* User Reviews */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-3xl font-bold">User Reviews</h1>
            <button 
              className="btn btn-primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="card bg-base-200 shadow-xl mb-6">
              <div className="card-body">
                <h3 className="card-title">Write Your Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Rating</span>
                    </label>
                    <StarRating rating={userRating} onRate={setUserRating} />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Your Review</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="Share your thoughts about this movie..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      maxLength={1000}
                    ></textarea>
                    <label className="label">
                      <span className="label-text-alt">{userReview.length}/1000</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={createReview.isPending}
                    >
                      {createReview.isPending ? "Submitting..." : "Submit Review"}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowReviewForm(false);
                        setUserRating(0);
                        setUserReview("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User Reviews List */}
          {userReviewsLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          ) : userReviews && userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title">
                          {review.userId.firstname} {review.userId.lastname}
                          {review.isVerifiedBooking && (
                            <span className="badge badge-success badge-sm ml-2">Verified</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      <StarRating rating={review.rating} readonly={true} />
                    </div>
                    {review.review && <p className="mt-4">{review.review}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No user reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;

