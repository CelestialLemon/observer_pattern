/**
 * What an observer can do?
 * It can emit a stream of values
 * Everytime a value is emitted all the callbacks that have been registered by subscribers should be called 
 * with that value
 * 
 * Subscribers should be able to subscribe and unsubscribe at will
 * 
 * No overhead if no subscribers
 */

type GenericCallback<T> = (value: T) => void;

class Observable<T> {
    private _subscriptions: Subscription<T>[] = [];

    public next(nextValue: T): void {
        this._subscriptions.forEach(sub => {
            sub._callback(nextValue);
        });
    }

    public subscribe(callback: GenericCallback<T>): Subscription<T> {
        const newSub = new Subscription<T>(this, callback);
        this._subscriptions.push(newSub);
        return newSub;
    }

    public unsubscribe(subscription: Subscription<T>): void {
        this._subscriptions = this._subscriptions.filter(sub => sub !== subscription);
    }
}

class Subscription<T> {
    private _observable: Observable<T>;
    private _isValid: boolean;

    public readonly _callback: GenericCallback<T>;

    constructor(observable: Observable<T>, callback: GenericCallback<T>) {
        this._observable = observable;
        this._callback = callback;
        this._isValid = true;
    }

    public unsubscribe(): void {
        this._observable.unsubscribe(this);
        this._isValid = false;
    }

    public get isValid(): boolean {
        return this._isValid;
    }
}


const main = () => {
    const numObserver = new Observable<number>();

    const callback1 = (newNum: number) => {
        console.log(newNum);
    };

    const callback2 = (newNum: number) => {
        console.log(newNum * newNum);
    };

    const sub1 = numObserver.subscribe(callback1);
    const sub2 = numObserver.subscribe(callback2);

    numObserver.next(10);
    numObserver.next(20);

    sub2.unsubscribe();

    numObserver.next(30);
    numObserver.next(40);

    console.log('sub 2 valid', sub2.isValid);
    console.log('sub 1 valid', sub1.isValid);
}

main();