## parse-time
Use `parse-time` to construct time from a UTC value using a specified format. See ["Time Formats" docs](https://docs.kadena.io/reference/functions/time#time-formatsh-299815639) for supported formats.

### Basic syntax

To construct time from a UTC value using a specified format, use the following syntax:

`(parse-time format utcval)`

### Arguments

Use the following arguments to specify the format and UTC value for constructing time using the `parse-time` Pact function.

| Argument | Type | Description |
| --- | --- | --- |
| `format` | string | Specifies the format for parsing the UTC value. |
| `utcval` | string | Specifies the UTC value to be parsed. |

### Return value

The `parse-time` function returns a time value constructed from the provided UTC value using the specified format.

### Examples

The following example demonstrates the use of `parse-time` in the Pact REPL:

```pact
pact>(parse-time "%F" "2016-09-12")
2016-09-12 00:00:00 UTC
```

In this example, `parse-time` is used to construct a time value from the UTC value "2016-09-12" using the format "%F".
