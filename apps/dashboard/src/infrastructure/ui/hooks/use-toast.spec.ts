import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, it, expect } from 'vitest';
import { useToastStore } from '../stores/toast.store';
import { toast, useToast } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('should add and dismiss a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Testing 123',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.dismiss(toastId);
    });

    // Dismiss only sets open to false, removal happens after delay
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('announces a success with its own title and variant', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.successToast('Paramètres enregistrés');
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Succès',
      description: 'Paramètres enregistrés',
      variant: 'success',
    });
  });

  it('announces an error with its own title and variant', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.errorToast('Enregistrement impossible');
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Erreur',
      description: 'Enregistrement impossible',
      variant: 'destructive',
    });
  });

  it('lets the caller override the default title of a success', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.successToast('Paramètres enregistrés', {
        title: 'Bravo',
      });
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Bravo',
      description: 'Paramètres enregistrés',
      variant: 'success',
    });
  });

  it('lets the caller override the default title of an error', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.errorToast('Enregistrement impossible', {
        title: 'Zut',
      });
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Zut',
      variant: 'destructive',
    });
  });

  it('surfaces the toasts raised outside of a component', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Raised elsewhere' });
    });

    expect(result.current.toasts[0]?.title).toBe('Raised elsewhere');
  });
});
