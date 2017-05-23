import React, { Component } from 'react';
import createShallowRenderer from './helpers/createShallowRenderer';
import expect from 'expect';
import createProxy from '../src';

function createModernFixtures() {
  class Base1 extends Component {
    static getY() {
      return 42;
    }

    getX() {
      return 42;
    }

    render() {
      return <div>Base1</div>;
    }
  }

  class Base2 extends Component {
    static getY() {
      return 43;
    }

    getX() {
      return 43;
    }

    render() {
      return <div>Base2</div>;
    }
  }

  return { Base1, Base2 };
}

describe('inheritance', () => {
  let renderer;
  let warnSpy;
  let Base1, Base2;

  beforeEach(() => {
    renderer = createShallowRenderer();
    warnSpy = expect.spyOn(console, 'error').andCallThrough();
    ({ Base1, Base2 } = createModernFixtures());
  });

  afterEach(() => {
    warnSpy.destroy();
    expect(warnSpy.calls.length).toBe(0);
  });

  describe('modern', () => {
    it('replaces a base instance method with proxied base and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived1 extends Base1 {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      class Derived extends BaseProxy {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      const derivedProxy = createProxy(Derived);
      const DerivedProxy = derivedProxy.get();

      const wrapper = renderer.render(<DerivedProxy />);
      expect(wrapper.props().children).toEqual(420);


      baseProxy.update(Base2);
      wrapper.instance().forceUpdate();
      expect(wrapper.props().children).toEqual(430);
    });

    it('replaces a base static method with proxied base and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 10}</span>;
        }
      }

      const derivedProxy = createProxy(Derived);
      const DerivedProxy = derivedProxy.get();

      const wrapper = renderer.render(<DerivedProxy />);
      expect(wrapper.props().children).toEqual(420);

      baseProxy.update(Base2);
      wrapper.instance().forceUpdate();
      expect(wrapper.props().children).toEqual(430);
    });

    it('replaces a base instance method with proxied base only', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived extends BaseProxy {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      const wrapper = renderer.render(<Derived />);
      expect(wrapper.props().children).toEqual(420);

      baseProxy.update(Base2);
      wrapper.update()
      wrapper.instance().forceUpdate();
      expect(wrapper.props().children).toEqual(430);
    });

    it('replaces a base static method with proxied base only', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 10}</span>;
        }
      }

      const instance = renderer.render(<Derived />);
      expect(instance.props().children).toEqual(420);

      baseProxy.update(Base2);
      instance.update();
      expect(instance.props().children).toEqual(430);
    });

    it('replaces a derived instance method with proxied base and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived1 extends BaseProxy {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      class Derived2 extends BaseProxy {
        render() {
          return <span>{super.getX() * 100}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual(420);

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual(4200);
    });

    it('replaces a derived static method with proxied base and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Derived1 extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 10}</span>;
        }
      }

      class Derived2 extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 100}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual(420);

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual(4200);
    });

    it('replaces a derived instance method with proxied derived only', () => {
      class Derived1 extends Base1 {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      class Derived2 extends Base1 {
        render() {
          return <span>{super.getX() * 100}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual(420);

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual(4200);
    });

    it('replaces a derived static method with proxied derived only', () => {
      class Derived1 extends Base1 {
        render() {
          return <span>{this.constructor.getY() * 10}</span>;
        }
      }

      class Derived2 extends Base1 {
        render() {
          return <span>{this.constructor.getY() * 100}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual(420);

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual(4200);
    });

    it('replaces any instance method with proxied base, middle and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Middle1 extends BaseProxy {
        render() {
          return <span>{super.getX() * 10}</span>;
        }
      }

      class Middle2 extends BaseProxy {
        render() {
          return <span>{super.getX() * 100}</span>;
        }
      }

      const middleProxy = createProxy(Middle1);
      const MiddleProxy = middleProxy.get();

      class Derived1 extends MiddleProxy {
        render() {
          return <span>{super.render().props.children + ' lol'}</span>;
        }
      }

      class Derived2 extends MiddleProxy {
        render() {
          return <span>{super.render().props.children + ' nice'}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual('420 lol');

      baseProxy.update(Base2);
      instance.update();
      expect(instance.props().children).toEqual('430 lol');

      middleProxy.update(Middle2);
      instance.update();
      expect(instance.props().children).toEqual('4300 lol');

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual('4300 nice');

      derivedProxy.update(Derived1);
      instance.update();
      expect(instance.props().children).toEqual('4300 lol');

      middleProxy.update(Middle1);
      instance.update();
      expect(instance.props().children).toEqual('430 lol');

      baseProxy.update(Base1);
      instance.update();
      expect(instance.props().children).toEqual('420 lol');
    });

    it('replaces any static method with proxied base, middle and derived', () => {
      const baseProxy = createProxy(Base1);
      const BaseProxy = baseProxy.get();

      class Middle1 extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 10}</span>;
        }
      }

      class Middle2 extends BaseProxy {
        render() {
          return <span>{this.constructor.getY() * 100}</span>;
        }
      }

      const middleProxy = createProxy(Middle1);
      const MiddleProxy = middleProxy.get();

      class Derived1 extends MiddleProxy {
        render() {
          return <span>{super.render().props.children + ' lol'}</span>;
        }
      }

      class Derived2 extends MiddleProxy {
        render() {
          return <span>{super.render().props.children + ' nice'}</span>;
        }
      }

      const derivedProxy = createProxy(Derived1);
      const DerivedProxy = derivedProxy.get();

      const instance = renderer.render(<DerivedProxy />);
      expect(instance.props().children).toEqual('420 lol');

      baseProxy.update(Base2);
      instance.update();
      expect(instance.props().children).toEqual('430 lol');

      middleProxy.update(Middle2);
      instance.update();
      expect(instance.props().children).toEqual('4300 lol');

      derivedProxy.update(Derived2);
      instance.update();
      expect(instance.props().children).toEqual('4300 nice');
    });
  });
});
