import { useEffect, useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useInterval = (callback: any, interval: any, immediate: any) => {
    const ref: any = useRef();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    useEffect(() => {
        let cancelled = false;

        const fn = () => {
            ref.current(() => cancelled);
        };

        const id = setInterval(fn, interval);
        if (immediate) fn();

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [interval, immediate]);
};