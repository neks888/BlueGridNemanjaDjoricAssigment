import { Request, Response } from 'express';
import { fetchAndTransformData } from '../services/filesService';

export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchAndTransformData();
    res.json(data);
  } catch (error) {
    
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
    
      
    res.status(500).send('Error fetching data');
  }
};
