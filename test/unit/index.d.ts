export interface Unko {
  toBeAt(expected: any, expectationFailOutput?: any): boolean;
}

declare namespace jasmine {
  interface Matchers<Point> {
    toBeAt(expected: any, expectationFailOutput?: any): boolean;
  }
}
