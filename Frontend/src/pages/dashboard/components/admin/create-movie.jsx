import { useState } from 'react';
import { useCreateMovie, useGetAllMovies } from '../../../../hooks/movie.hooks';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '../../../../util/storageService/firebase';
import { v4 } from 'uuid';

const CreateMovieTab = () => {
  const { data: movies } = useGetAllMovies();
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <CreateMovieForm />
      </div>
      <div style={{ width: '50%', padding: '10px' }}>
        {movies &&
          movies.map((movie) => (
            <div key={movie._id}>
              <pre>{JSON.stringify(movie, null, 2)}</pre>
            </div>
          ))}
      </div>
    </div>
  );
};

const CreateMovieForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const [imageUpload, setImageUpload] = useState(null);


  const { mutateAsync: createMovieAsync } = useCreateMovie();

  const uploadFile = async () => {
    if (imageUpload == null || imageUpload == '') return;
    let urlImg = '';
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    urlImg = await getDownloadURL(imageRef);
    return urlImg;
  };


  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const url = await uploadFile();
      const movieData = {
        title,
        description,
        language,
        imageURL: url,
        durationInMinutes: Number(durationInMinutes),
      };
      console.log('movieData', movieData);
      const filteredMovieData = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(movieData).filter(([_, value]) => value)
      );

      await createMovieAsync(filteredMovieData);
      setTitle('');
      setDescription('');
      setLanguage('');
      setImageUpload(null);
      setDurationInMinutes('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };
  const handleImageUpload = (e) => {
    setImageUpload(e.target.files[0]);
  };
  const handleDurationInMinutes = (e) => {
    setDurationInMinutes(e.target.value);
  };

  return (
    <div>
      <div className='form flex flex-col gap-2'>
        {/* title */}
          <input type="text" className="grow input input-bordered" placeholder="TITLE" onChange={handleTitle}/>
        {/* description */}
        <input type="text" className="grow input input-bordered" placeholder="DESCRIPTION" onChange={handleDescription}/>
        {/* language */}
          <input type="text" className="grow input input-bordered" placeholder="LANGUAGE" onChange={handleLanguage}/>
        {/* image URL */}
        <input type="file" className="file-input file-input-bordered w-full grow" placeholder='ADD MOVIE BANER' onChange={handleImageUpload}/>
        {/* duration in minutes */}
          <input type="text" className="grow input input-bordered" placeholder="DURATION IN MINUTES" onChange={handleDurationInMinutes} />
        {/* submit Button */}
          <button className="btn btn-outline btn-primary" onClick={handleCreateMovie}>CREATE MOVIE</button>
      </div>
    </div>
  );
};

export default CreateMovieTab;
