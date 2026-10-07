import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from './toast.store';

function store() {
  return useToastStore.getState();
}

function titles(): unknown[] {
  return store().toasts.map((toast) => toast.title);
}

describe('toast store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens the toast it adds', () => {
    store().addToast({ title: 'Saved', description: 'Settings saved' });

    expect(store().toasts).toHaveLength(1);
    expect(store().toasts[0]).toMatchObject({
      title: 'Saved',
      description: 'Settings saved',
      open: true,
    });
  });

  it('gives every toast an identifier of its own', () => {
    const first = store().addToast({ title: 'First' });
    const second = store().addToast({ title: 'Second' });

    expect(first.id).not.toBe(second.id);
  });

  it('stacks the newest toast first', () => {
    store().addToast({ title: 'First' });
    store().addToast({ title: 'Second' });

    expect(titles()).toEqual(['Second', 'First']);
  });

  it('keeps only the five most recent toasts', () => {
    ['1', '2', '3', '4', '5', '6', '7'].forEach((title) =>
      store().addToast({ title }),
    );

    expect(titles()).toEqual(['7', '6', '5', '4', '3']);
  });

  it('updates the toast carrying the given identifier', () => {
    const { id } = store().addToast({ title: 'Uploading' });
    store().addToast({ title: 'Untouched' });

    store().updateToast({ id, title: 'Uploaded' });

    expect(titles()).toEqual(['Untouched', 'Uploaded']);
  });

  it('leaves the toast alone when the identifier is unknown', () => {
    store().addToast({ title: 'Uploading' });

    store().updateToast({ id: 'unknown', title: 'Uploaded' });

    expect(titles()).toEqual(['Uploading']);
  });

  it('closes the toast carrying the given identifier', () => {
    const { id } = store().addToast({ title: 'Closing' });
    store().addToast({ title: 'Staying' });

    store().dismissToast(id);

    expect(store().toasts.map((toast) => toast.open)).toEqual([true, false]);
  });

  it('closes every toast when no identifier is given', () => {
    store().addToast({ title: 'First' });
    store().addToast({ title: 'Second' });

    store().dismissToast();

    expect(store().toasts.map((toast) => toast.open)).toEqual([false, false]);
  });

  it('drops the closed toast once the removal delay has elapsed', () => {
    const { id } = store().addToast({ title: 'Closing' });

    store().dismissToast(id);
    vi.runAllTimers();

    expect(store().toasts).toEqual([]);
  });

  it('keeps the closed toast until the removal delay has elapsed', () => {
    const { id } = store().addToast({ title: 'Closing' });

    store().dismissToast(id);

    expect(store().toasts).toHaveLength(1);
  });

  it('removes the toast carrying the given identifier', () => {
    const { id } = store().addToast({ title: 'Gone' });
    store().addToast({ title: 'Staying' });

    store().removeToast(id);

    expect(titles()).toEqual(['Staying']);
  });

  it('clears every toast when no identifier is given', () => {
    store().addToast({ title: 'First' });
    store().addToast({ title: 'Second' });

    store().removeToast();

    expect(store().toasts).toEqual([]);
  });

  it('closes the toast through the handle it hands back', () => {
    const handle = store().addToast({ title: 'Closing' });

    handle.dismiss();

    expect(store().toasts[0]?.open).toBe(false);
  });

  it('updates the toast through the handle it hands back', () => {
    const handle = store().addToast({ title: 'Uploading' });

    handle.update({ id: handle.id, title: 'Uploaded' });

    expect(titles()).toEqual(['Uploaded']);
  });

  it('closes the toast when the toast reports it was closed', () => {
    store().addToast({ title: 'Closing' });

    store().toasts[0]?.onOpenChange?.(false);

    expect(store().toasts[0]?.open).toBe(false);
  });

  it('leaves the toast open when the toast reports it was opened', () => {
    store().addToast({ title: 'Staying' });

    store().toasts[0]?.onOpenChange?.(true);

    expect(store().toasts[0]?.open).toBe(true);
  });
});
