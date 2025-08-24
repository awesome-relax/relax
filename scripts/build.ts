import { assemble } from 't-packer';

const build = () => {
  return Promise.all([
    assemble({
      src: 'packages/relax-react/src',
      output: 'packages/relax-react/dist',
    }),
    assemble({
      src: 'packages/core/src',
      output: 'packages/core/dist',
    }),
  ]);
};

if (require.main === module) {
  build();
}
