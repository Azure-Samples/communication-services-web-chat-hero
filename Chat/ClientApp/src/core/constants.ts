export class Constants {
    // Project settings
    static GUID_FOR_INITIAL_TOPIC_NAME = 'c774da81-94d5-4652-85c7-6ed0e8dc67e6';

    // Project configurations
    static INITIAL_MESSAGES_SIZE = 2000;
    static MAXIMUM_LENGTH_OF_NAME = 10;
    static MAXIMUM_LENGTH_OF_MESSAGE = 8000;
    static MAXIMUM_LENGTH_OF_TOPIC = 30;
    static MAXIMUM_LENGTH_OF_TYPING_USERS = 35;
    static MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;
    static MAXIMUM_INT64 = 9223372036854775807;
    static NUMBER_OF_MESSAGES_TO_LOAD = 10;
    static PAGE_SIZE = 200;
    static PARTICIPANTS_THRESHOLD = 20;

    static MINI_HEADER_WINDOW_WIDTH = 952;

    // Keyboard keys
    static ENTER_KEY = 13;
    static SPACE_KEY = 32;

    // Http Status Code
    static OK = 200;

    // Regex
    static URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    static EMPTY_MESSAGE_REGEX = /^\s*$/;
}
