import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LangCode = 'ko' | 'en' | 'ja' | 'zh' | 'vi';

interface LanguageState {
  lang: LangCode;
}

const initialState: LanguageState = {
  lang: 'ko',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LangCode>) {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
