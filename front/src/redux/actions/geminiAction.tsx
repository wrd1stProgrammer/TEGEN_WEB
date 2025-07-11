import { appAxios } from '../config/apiConfig';




export const geminiImageAction = (imageResponse:string, sex:string, lang: string) => async (dispatch: any) => {
  try {
    const res = await appAxios.post('/gemini/analyzeface',{
      imageResponse,
      sex,
      lang,
    });
    
    return res;
    
  } catch (error: any) {
    console.log('Test:  ->', error);
  }
}; // api Ok.