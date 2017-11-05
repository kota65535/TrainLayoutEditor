export abstract class Storable<T> {
  abstract set storeState(value: T);
  abstract get storeState(): T;
}
