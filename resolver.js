const { PubSub } = require('apollo-server-express');

const pubsub = new PubSub(); //create a PubSub instance
const CHANNEL_ADDED_TOPIC = 'newChannel';


const channels = [{
    id: 1,
    name: 'soccer',
  }, {
    id: 2,
    name: 'baseball',
  }];
  
  let nextId = 3;
  
const resolvers = {
    Query: {
        channels: () => {
        return channels;
        },
        channel: (root, { id }) => {
        return channels.find(channel => channel.id == id);
        },
    },
    Mutation: {
        addChannel: (root, args) => {  //Create a mutation to add a new channel.
            const newChannel = { id: String(nextId++), messages: [], name: args.name };
            channels.push(newChannel);
            pubsub.publish(CHANNEL_ADDED_TOPIC, { channelAdded: newChannel });  // publish to a topic
            return newChannel;
        }
    },
    Subscription: {
        channelAdded: {  // create a channelAdded subscription resolver function.
          subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)  // subscribe to changes in a topic
        }
    }
};

module.exports = resolvers;