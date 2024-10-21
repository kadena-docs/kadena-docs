## time
The `time` function constructs a time object from a UTC value using the ISO8601 format `(%Y-%m-%dT%H:%M:%SZ)`.

### Basic syntax

To construct a time object from a UTC value, use the following syntax:

`(time UTC)`

### Arguments

Use the following argument to specify the UTC value for constructing the time object using the `time` Pact function.

| Argument | Type | Description |
| --- | --- | --- |
| `UTC` | `string` | Specifies the UTC value in ISO8601 format `(%Y-%m-%dT%H:%M:%SZ)`. |

### Return value

The `time` function returns a time object constructed from the provided UTC value.

### Examples

The following example demonstrates the usage of the `time` function within the Pact REPL. It constructs a time object from the UTC value `"2016-07-22T11:26:35Z"`:

```pact
pact>(time "2016-07-22T11:26:35Z")
2016-07-22 11:26:35 UTC
```

This example illustrates how to use the `time` function to create a time object from a UTC value using the ISO8601 format in Pact.
